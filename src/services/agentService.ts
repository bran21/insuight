/**
 * Insuight — AI Agent Service
 * Manages agent reasoning, tool calling, and inner monologue
 */

import * as predictApi from './predictApi';

// ─── Types ──────────────────────────────────────────────────

export type MonologueTag = 'research' | 'analyze' | 'signal' | 'propose' | 'waiting' | 'error' | 'info';

export interface MonologueLine {
  id: string;
  timestamp: number;
  tag: MonologueTag;
  message: string;
}

export interface TradeProposal {
  id: string;
  oracleId: string;
  oracleName: string;
  expiry: number;
  strike: number;
  isUp: boolean;
  quantity: number;
  aiProbability: number;
  oracleFairPrice: number;
  edge: number;
  reasoning: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AgentState {
  isRunning: boolean;
  monologue: MonologueLine[];
  proposals: TradeProposal[];
  cycleCount: number;
}

// ─── Helper ─────────────────────────────────────────────────

let lineCounter = 0;

function createLine(tag: MonologueTag, message: string): MonologueLine {
  return {
    id: `line-${++lineCounter}`,
    timestamp: Date.now(),
    tag,
    message,
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// ─── Agent Runner ───────────────────────────────────────────

/**
 * Run one agent research cycle.
 * Returns the monologue lines and any trade proposals generated.
 */
export async function runAgentCycle(): Promise<{
  lines: MonologueLine[];
  proposals: TradeProposal[];
}> {
  const lines: MonologueLine[] = [];
  const proposals: TradeProposal[] = [];

  // Step 1: Fetch oracles
  lines.push(createLine('research', 'Scanning active oracles from DeepBook Predict...'));

  let oracles: predictApi.OracleState[] = [];
  try {
    oracles = await predictApi.getOracles();
    lines.push(createLine('info', `Found ${oracles.length} oracle(s) on testnet`));
  } catch (err) {
    lines.push(createLine('error', `Failed to fetch oracles: ${err instanceof Error ? err.message : 'Unknown error'}`));
    return { lines, proposals };
  }

  if (oracles.length === 0) {
    lines.push(createLine('info', 'No active oracles found. Waiting for next cycle...'));
    return { lines, proposals };
  }

  // Step 2: Analyze each oracle
  for (const oracle of oracles) {
    lines.push(createLine('research', `Analyzing oracle: ${oracle.name || oracle.oracle_id.slice(0, 10)}...`));
    
    // Simulated AI analysis (in production, this would call an LLM)
    const aiProbability = simulateAIProbability(oracle);
    const oracleFairPrice = oracle.forward > 0 ? oracle.forward : oracle.spot;
    
    lines.push(createLine('analyze', `Oracle spot: $${oracle.spot?.toFixed(2) || '?'} | Forward: $${oracleFairPrice?.toFixed(2) || '?'}`));
    lines.push(createLine('analyze', `AI probability estimate (UP): ${(aiProbability * 100).toFixed(1)}%`));

    // Step 3: Detect mispricing
    const edge = Math.abs(aiProbability - 0.5); // simplified edge calculation
    
    if (edge > 0.05) { // 5% edge threshold
      const isUp = aiProbability > 0.5;
      const direction = isUp ? 'UP ↑' : 'DOWN ↓';
      
      lines.push(createLine('signal', `⚡ Mispricing detected! Edge: ${(edge * 100).toFixed(1)}% → ${direction}`));
      
      // Step 4: Create trade proposal
      const proposal: TradeProposal = {
        id: generateId(),
        oracleId: oracle.oracle_id,
        oracleName: oracle.name || oracle.oracle_id.slice(0, 16),
        expiry: oracle.expiry,
        strike: Math.round(oracleFairPrice),
        isUp,
        quantity: 10, // 10 DUSDC default
        aiProbability,
        oracleFairPrice,
        edge,
        reasoning: `AI model estimates ${(aiProbability * 100).toFixed(1)}% probability of price moving ${direction}. Oracle fair price at $${oracleFairPrice?.toFixed(2)}. Detected ${(edge * 100).toFixed(1)}% edge over market consensus.`,
        status: 'pending',
      };

      proposals.push(proposal);
      lines.push(createLine('propose', `📋 Trade proposal created: ${direction} position, ${proposal.quantity} DUSDC`));
    } else {
      lines.push(createLine('info', `No significant mispricing (edge: ${(edge * 100).toFixed(1)}%). Skipping.`));
    }
  }

  lines.push(createLine('waiting', 'Cycle complete. Awaiting user review of proposals...'));
  return { lines, proposals };
}

/**
 * Simulated AI probability calculation.
 * In production, this would call an LLM with news context.
 */
function simulateAIProbability(oracle: predictApi.OracleState): number {
  // Use oracle data to generate a pseudo-intelligent probability
  const baseProb = 0.5;
  
  if (oracle.spot && oracle.forward) {
    const trend = (oracle.forward - oracle.spot) / oracle.spot;
    return Math.max(0.1, Math.min(0.9, baseProb + trend * 2));
  }
  
  // Fallback: slight random deviation from 50%
  return baseProb + (Math.random() - 0.5) * 0.3;
}

/**
 * Generate demo monologue for when no live oracles are available.
 * This demonstrates the agent's capabilities.
 */
export function generateDemoMonologue(): MonologueLine[] {
  return [
    createLine('research', 'Initializing Insuight Agent v1.0...'),
    createLine('info', 'Connected to DeepBook Predict Server (Testnet)'),
    createLine('research', 'Scanning oracles for active markets...'),
    createLine('analyze', 'Found BTC/USD oracle — Expiry: May 20, 2026'),
    createLine('analyze', 'Oracle spot: $68,420 | Forward: $69,100 | SVI σ: 0.42'),
    createLine('research', 'Fetching latest crypto news and sentiment data...'),
    createLine('analyze', 'ETF inflow signal: +$312M (bullish)'),
    createLine('analyze', 'On-chain whale accumulation: +2,400 BTC (bullish)'),
    createLine('analyze', 'AI model probability (UP above $68,000): 72.4%'),
    createLine('analyze', 'Oracle implied probability: 58.1%'),
    createLine('signal', '⚡ Mispricing detected! Edge: +14.3% → UP ↑'),
    createLine('propose', '📋 Proposed: MINT UP position | Strike: $68,000 | Qty: 50 DUSDC'),
    createLine('propose', 'Expected payout: ~86 DUSDC if correct (+72%)'),
    createLine('waiting', '⏳ Awaiting user signature to execute trade...'),
  ];
}
