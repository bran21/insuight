import { Transaction } from '@mysten/sui/transactions';
import { computeFinalSignal, DIRECTION_UP } from './prediction-algorithm';

/**
 * Script to Create a Market Prediction
 * 
 * 1. Uses the Prediction Source Algorithm to evaluate current market conditions.
 * 2. Creates the Prediction Market on-chain if conditions are actionable.
 */

const PACKAGE_ID = '0x123...'; // Replace with deployed predict package ID

export function createActionableMarketPrediction(
    spotPrice: number,
    forwardPrice: number,
    sigmaBps: number,
    strikePrice: number,
    oracleImpliedBps: number,
    marketDescription: string,
    yesTreasuryId: string,
    noTreasuryId: string
): Transaction | null {
    // 1. Run the Prediction Source Algorithm
    const signal = computeFinalSignal(spotPrice, forwardPrice, sigmaBps, strikePrice, oracleImpliedBps, 500);
    
    console.log(`Evaluating Market: ${marketDescription}`);
    console.log(`Prediction Algorithm Output -> Conviction: ${(signal.convictionBps / 100).toFixed(2)}%, Direction: ${signal.direction === DIRECTION_UP ? "YES" : "NO"}`);
    
    if (!signal.isActionable) {
        console.log("Signal is not actionable right now (edge too small). Aborting market creation.");
        return null;
    }
    
    console.log("Signal is actionable! Proceeding to create the market prediction on-chain...");

    // 2. Build the transaction to create the market on-chain
    const tx = new Transaction();
    
    tx.moveCall({
        target: `${PACKAGE_ID}::market::create_market`,
        arguments: [
            tx.pure.string(marketDescription),
            tx.object(yesTreasuryId),
            tx.object(noTreasuryId)
        ]
    });
    
    return tx;
}

// Example Execution
const tx = createActionableMarketPrediction(
    68000, 69000, 4200, 68000, 5500,
    "Will Bitcoin be above 68k?",
    "0xYES_TREASURY_ID",
    "0xNO_TREASURY_ID"
);

if (tx) {
    console.log("Transaction Block for creating the market is ready for signing!");
}
