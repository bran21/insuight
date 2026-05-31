/**
 * Prediction Source Algorithm
 * 
 * Ported from the on-chain `signal_engine.move` to visually output 
 * the AI's trade signal logic in the frontend.
 */

const BPS_DENOMINATOR = 10000;
const MOMENTUM_WEIGHT_BPS = 6000;
const REVERSION_WEIGHT_BPS = 4000;
const MIN_SIGMA_BPS = 100;
const REVERSION_THRESHOLD_BPS = 300;
const MAX_CONVICTION_BPS = 9500;
const MIN_CONVICTION_BPS = 500;

export const DIRECTION_DOWN = 0;
export const DIRECTION_UP = 1;

export interface TradeSignal {
    direction: number;
    convictionBps: number;
    momentumBps: number;
    reversionBps: number;
    edgeBps: number;
    isActionable: boolean;
}

function clamp(value: number, minVal: number, maxVal: number): number {
    return Math.max(minVal, Math.min(maxVal, value));
}

export function computeMomentumSignal(spotPrice: number, forwardPrice: number, sigmaBps: number) {
    if (spotPrice === 0) return { direction: DIRECTION_UP, conviction: 5000 };

    const isUp = forwardPrice >= spotPrice;
    const direction = isUp ? DIRECTION_UP : DIRECTION_DOWN;
    const premiumBps = Math.floor(Math.abs(forwardPrice - spotPrice) * BPS_DENOMINATOR / spotPrice);

    const rawConviction = 5000 + (premiumBps * 10);
    const effectiveSigma = Math.max(sigmaBps, MIN_SIGMA_BPS);
    
    const deviationFromNeutral = Math.abs(rawConviction - 5000);
    const volScale = effectiveSigma > 0 ? (3000 * BPS_DENOMINATOR) / effectiveSigma : BPS_DENOMINATOR;
    
    const adjustedDeviation = Math.floor((deviationFromNeutral * volScale) / BPS_DENOMINATOR);
    const conviction = 5000 + adjustedDeviation;

    return { direction, conviction: clamp(conviction, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS) };
}

export function computeReversionSignal(spotPrice: number, forwardPrice: number, strikePrice: number) {
    if (strikePrice === 0 || spotPrice === 0) return { direction: DIRECTION_UP, conviction: 5000 };

    const reference = forwardPrice > 0 ? forwardPrice : spotPrice;
    const isUp = reference < strikePrice;
    const direction = isUp ? DIRECTION_UP : DIRECTION_DOWN;
    
    const deviationBps = Math.floor(Math.abs(reference - strikePrice) * BPS_DENOMINATOR / strikePrice);

    if (deviationBps < REVERSION_THRESHOLD_BPS) {
        return { direction: DIRECTION_UP, conviction: 5000 };
    }

    const rawConviction = 5000 + (deviationBps * 5);
    return { direction, conviction: clamp(rawConviction, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS) };
}

export function computeFinalSignal(
    spotPrice: number,
    forwardPrice: number,
    sigmaBps: number,
    strikePrice: number,
    oracleImpliedBps: number,
    minEdgeBps: number
): TradeSignal {
    const mom = computeMomentumSignal(spotPrice, forwardPrice, sigmaBps);
    const rev = computeReversionSignal(spotPrice, forwardPrice, strikePrice);

    let finalDirection: number;
    let finalConviction: number;

    if (mom.direction === rev.direction) {
        finalDirection = mom.direction;
        finalConviction = Math.floor(
            (mom.conviction * MOMENTUM_WEIGHT_BPS + rev.conviction * REVERSION_WEIGHT_BPS) / BPS_DENOMINATOR
        );
    } else {
        finalDirection = mom.direction;
        const momDev = Math.abs(mom.conviction - 5000);
        const revDev = Math.abs(rev.conviction - 5000);

        if (momDev > revDev) {
            finalConviction = 5000 + Math.floor((momDev - revDev) / 2);
        } else {
            finalDirection = rev.direction;
            finalConviction = 5000 + Math.floor((revDev - momDev) / 2);
        }
    }

    finalConviction = clamp(finalConviction, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS);
    const edgeBps = Math.abs(finalConviction - oracleImpliedBps);
    const isActionable = edgeBps >= minEdgeBps;

    return {
        direction: finalDirection,
        convictionBps: finalConviction,
        momentumBps: mom.conviction,
        reversionBps: rev.conviction,
        edgeBps,
        isActionable
    };
}
