/**
 * Insuight — On-Chain Signal Engine (TypeScript Mirror)
 *
 * Client-side implementation of the same deterministic algorithms
 * in signal_engine.move. Used for real-time monologue display
 * without waiting for on-chain transactions.
 *
 * CRITICAL: This must produce identical outputs to the Move version
 * for the same inputs.
 */

// ─── Constants (match Move exactly) ─────────────────────────

const BPS_DENOMINATOR = 10000;
const MOMENTUM_WEIGHT_BPS = 6000;
const REVERSION_WEIGHT_BPS = 4000;
const MIN_SIGMA_BPS = 100;
const REVERSION_THRESHOLD_BPS = 300;
const MAX_CONVICTION_BPS = 9500;
const MIN_CONVICTION_BPS = 500;

export const DIRECTION_DOWN = 0;
export const DIRECTION_UP = 1;

// ─── Types ──────────────────────────────────────────────────

export interface TradeSignal {
  direction: number;         // 0=DOWN, 1=UP
  convictionBps: number;     // 500-9500
  momentumBps: number;       // momentum strategy output
  reversionBps: number;      // reversion strategy output
  edgeBps: number;           // |conviction - oracle_implied|
  isActionable: boolean;     // edge >= min_edge
}

export interface SignalReasoning {
  step: string;
  tag: 'research' | 'analyze' | 'signal' | 'propose' | 'info';
  message: string;
}

// ─── Helper ─────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ─── Strategy 1: Momentum Scoring ───────────────────────────

/**
 * Measures spot-to-forward premium as a directional signal.
 * Forward > Spot = bullish momentum.
 * Higher volatility dampens conviction toward neutral.
 */
export function computeMomentumSignal(
  spotPrice: number,
  forwardPrice: number,
  sigmaBps: number,
): { direction: number; convictionBps: number } {
  if (spotPrice === 0) {
    return { direction: DIRECTION_UP, convictionBps: 5000 };
  }

  let direction: number;
  let premiumBps: number;

  if (forwardPrice >= spotPrice) {
    direction = DIRECTION_UP;
    premiumBps = Math.floor(((forwardPrice - spotPrice) * BPS_DENOMINATOR) / spotPrice);
  } else {
    direction = DIRECTION_DOWN;
    premiumBps = Math.floor(((spotPrice - forwardPrice) * BPS_DENOMINATOR) / spotPrice);
  }

  // Raw conviction = 5000 (neutral) + premium * 10
  const rawConviction = 5000 + premiumBps * 10;

  // Volatility dampening
  const effectiveSigma = Math.max(sigmaBps, MIN_SIGMA_BPS);
  const deviationFromNeutral = Math.abs(rawConviction - 5000);

  const volScale = effectiveSigma > 0
    ? (3000 * BPS_DENOMINATOR) / effectiveSigma
    : BPS_DENOMINATOR;

  const adjustedDeviation = Math.floor((deviationFromNeutral * volScale) / BPS_DENOMINATOR);
  const conviction = 5000 + adjustedDeviation;

  return {
    direction,
    convictionBps: clamp(conviction, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS),
  };
}

// ─── Strategy 2: Mean Reversion ─────────────────────────────

/**
 * When price deviates significantly from strike, predicts reversion.
 * Bigger deviation = stronger signal.
 */
export function computeReversionSignal(
  spotPrice: number,
  forwardPrice: number,
  strikePrice: number,
): { direction: number; convictionBps: number } {
  if (strikePrice === 0 || spotPrice === 0) {
    return { direction: DIRECTION_UP, convictionBps: 5000 };
  }

  const reference = forwardPrice > 0 ? forwardPrice : spotPrice;

  let direction: number;
  let deviationBps: number;

  if (reference > strikePrice) {
    direction = DIRECTION_DOWN;
    deviationBps = Math.floor(((reference - strikePrice) * BPS_DENOMINATOR) / strikePrice);
  } else {
    direction = DIRECTION_UP;
    deviationBps = Math.floor(((strikePrice - reference) * BPS_DENOMINATOR) / strikePrice);
  }

  // Below threshold: neutral
  if (deviationBps < REVERSION_THRESHOLD_BPS) {
    return { direction: DIRECTION_UP, convictionBps: 5000 };
  }

  const rawConviction = 5000 + deviationBps * 5;
  return {
    direction,
    convictionBps: clamp(rawConviction, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS),
  };
}

// ─── Edge Calculation ───────────────────────────────────────

export function computeEdge(
  aiConvictionBps: number,
  oracleImpliedBps: number,
  minEdgeBps: number,
): { edgeBps: number; isActionable: boolean } {
  const edgeBps = Math.abs(aiConvictionBps - oracleImpliedBps);
  return {
    edgeBps,
    isActionable: edgeBps >= minEdgeBps,
  };
}

// ─── Implied Probability Helper ─────────────────────────────

export function deriveImpliedProbability(
  spotPrice: number,
  forwardPrice: number,
  strikePrice: number,
): number {
  if (forwardPrice === 0 || spotPrice === 0) return 5000;

  const spread = Math.abs(strikePrice - spotPrice);
  const denominator = forwardPrice + spread;
  if (denominator === 0) return 5000;

  const probBps = Math.floor((forwardPrice * BPS_DENOMINATOR) / denominator);
  return clamp(probBps, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS);
}

// ─── Ensemble Combiner ──────────────────────────────────────

/**
 * Combines momentum and reversion into a single trade signal.
 * This is the main entry point — mirrors signal_engine::compute_final_signal().
 */
export function computeFinalSignal(
  spotPrice: number,
  forwardPrice: number,
  sigmaBps: number,
  strikePrice: number,
  oracleImpliedBps: number,
  minEdgeBps: number,
): TradeSignal {
  // Strategy 1: Momentum
  const mom = computeMomentumSignal(spotPrice, forwardPrice, sigmaBps);

  // Strategy 2: Mean Reversion
  const rev = computeReversionSignal(spotPrice, forwardPrice, strikePrice);

  let finalDirection: number;
  let finalConviction: number;

  if (mom.direction === rev.direction) {
    // Agreement: weighted average
    finalDirection = mom.direction;
    finalConviction = Math.floor(
      (mom.convictionBps * MOMENTUM_WEIGHT_BPS + rev.convictionBps * REVERSION_WEIGHT_BPS)
      / BPS_DENOMINATOR
    );
  } else {
    // Disagreement: use stronger signal, penalize conviction
    const momDev = Math.abs(mom.convictionBps - 5000);
    const revDev = Math.abs(rev.convictionBps - 5000);

    if (momDev > revDev) {
      finalDirection = mom.direction;
      finalConviction = 5000 + Math.floor((momDev - revDev) / 2);
    } else {
      finalDirection = rev.direction;
      finalConviction = 5000 + Math.floor((revDev - momDev) / 2);
    }
  }

  finalConviction = clamp(finalConviction, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS);

  // Edge
  const { edgeBps, isActionable } = computeEdge(finalConviction, oracleImpliedBps, minEdgeBps);

  return {
    direction: finalDirection,
    convictionBps: finalConviction,
    momentumBps: mom.convictionBps,
    reversionBps: rev.convictionBps,
    edgeBps,
    isActionable,
  };
}

// ─── Reasoning Generator ────────────────────────────────────

/**
 * Generate step-by-step reasoning for the Agent Console monologue.
 * Uses the same algorithm but produces human-readable explanations.
 */
export function generateSignalReasoning(
  oracleName: string,
  spotPrice: number,
  forwardPrice: number,
  sigmaBps: number,
  strikePrice: number,
  minEdgeBps: number = 500,
): { signal: TradeSignal; reasoning: SignalReasoning[] } {
  const reasoning: SignalReasoning[] = [];

  // Step 1: Data collection
  reasoning.push({
    step: 'fetch',
    tag: 'research',
    message: `Fetching oracle data for ${oracleName}...`,
  });

  reasoning.push({
    step: 'data',
    tag: 'analyze',
    message: `Spot: $${spotPrice.toLocaleString()} | Forward: $${forwardPrice.toLocaleString()} | SVI σ: ${(sigmaBps / 100).toFixed(1)}%`,
  });

  // Step 2: Momentum
  const mom = computeMomentumSignal(spotPrice, forwardPrice, sigmaBps);
  const momDir = mom.direction === DIRECTION_UP ? 'BULLISH ↑' : 'BEARISH ↓';
  const premiumPct = ((Math.abs(forwardPrice - spotPrice) / spotPrice) * 100).toFixed(2);

  reasoning.push({
    step: 'momentum',
    tag: 'analyze',
    message: `Momentum engine: ${premiumPct}% forward premium → ${momDir} (${(mom.convictionBps / 100).toFixed(1)}% conviction)`,
  });

  // Step 3: Mean Reversion
  const rev = computeReversionSignal(spotPrice, forwardPrice, strikePrice);
  const revDir = rev.direction === DIRECTION_UP ? 'UP ↑' : 'DOWN ↓';
  const deviationPct = ((Math.abs(forwardPrice - strikePrice) / strikePrice) * 100).toFixed(2);

  reasoning.push({
    step: 'reversion',
    tag: 'analyze',
    message: `Reversion engine: ${deviationPct}% strike deviation → ${revDir} (${(rev.convictionBps / 100).toFixed(1)}% conviction)`,
  });

  // Step 4: Ensemble
  const oracleImpliedBps = deriveImpliedProbability(spotPrice, forwardPrice, strikePrice);
  const signal = computeFinalSignal(
    spotPrice, forwardPrice, sigmaBps, strikePrice, oracleImpliedBps, minEdgeBps
  );

  const ensembleDir = signal.direction === DIRECTION_UP ? 'UP ↑' : 'DOWN ↓';
  reasoning.push({
    step: 'ensemble',
    tag: 'analyze',
    message: `Ensemble (60% momentum + 40% reversion): ${ensembleDir} | AI probability: ${(signal.convictionBps / 100).toFixed(1)}%`,
  });

  // Step 5: Edge
  reasoning.push({
    step: 'edge',
    tag: 'analyze',
    message: `Oracle implied: ${(oracleImpliedBps / 100).toFixed(1)}% | AI conviction: ${(signal.convictionBps / 100).toFixed(1)}% | Edge: ${(signal.edgeBps / 100).toFixed(1)}%`,
  });

  // Step 6: Decision
  if (signal.isActionable) {
    reasoning.push({
      step: 'signal',
      tag: 'signal',
      message: `⚡ ACTIONABLE SIGNAL: Edge ${(signal.edgeBps / 100).toFixed(1)}% exceeds ${(minEdgeBps / 100).toFixed(1)}% threshold → ${ensembleDir}`,
    });
    reasoning.push({
      step: 'propose',
      tag: 'propose',
      message: `📋 Proposed: MINT ${signal.direction === DIRECTION_UP ? 'UP' : 'DOWN'} position | Strike: $${strikePrice.toLocaleString()} | Conviction: ${(signal.convictionBps / 100).toFixed(1)}%`,
    });
  } else {
    reasoning.push({
      step: 'no_signal',
      tag: 'info',
      message: `Edge ${(signal.edgeBps / 100).toFixed(1)}% below ${(minEdgeBps / 100).toFixed(1)}% threshold. No trade proposed.`,
    });
  }

  return { signal, reasoning };
}
