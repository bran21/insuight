import { Transaction } from '@mysten/sui/transactions';
import { CUSTOM_MARKET_PACKAGE } from '../constants';

/**
 * Builds a transaction to create a new custom prediction market.
 * Note: Only the deployer of the package can call this, as it requires the TreasuryCaps
 * which are transferred to the deployer upon package initialization.
 * 
 * @param description The question/statement for the prediction market
 * @param yesTreasuryId The object ID of the YES token TreasuryCap
 * @param noTreasuryId The object ID of the NO token TreasuryCap
 * @returns A Transaction object ready to be signed and executed
 */
export function buildCreateMarketTx(
  description: string,
  yesTreasuryId: string,
  noTreasuryId: string
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${CUSTOM_MARKET_PACKAGE}::market::create_market`,
    arguments: [
      tx.pure.string(description),
      tx.object(yesTreasuryId),
      tx.object(noTreasuryId),
    ],
  });

  return tx;
}

/**
 * Builds a transaction for a user to mint YES and NO shares.
 * User locks SUI and receives an equal amount of YES and NO tokens.
 * 
 * @param marketId The object ID of the shared Market object
 * @param suiAmount The amount of SUI to lock (in MIST, i.e. 1 SUI = 1_000_000_000)
 * @param userAddress The address to send the minted tokens to
 * @returns A Transaction object ready to be signed and executed
 */
export function buildMintSharesTx(
  marketId: string,
  suiAmount: string | number,
  userAddress: string
): Transaction {
  const tx = new Transaction();

  // Split the exact amount of SUI from the gas coin
  const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(suiAmount)]);

  // Call the mint function which returns YES and NO coins
  const [yesCoin, noCoin] = tx.moveCall({
    target: `${CUSTOM_MARKET_PACKAGE}::market::mint`,
    arguments: [tx.object(marketId), payment],
  });

  // Transfer the minted coins to the user
  tx.transferObjects([yesCoin, noCoin], tx.pure.address(userAddress));

  return tx;
}

/**
 * Builds a transaction for the admin to resolve the market.
 * 
 * @param marketId The object ID of the shared Market object
 * @param adminCapId The object ID of the AdminCap associated with this market
 * @param winner 1 if YES won, 2 if NO won
 * @returns A Transaction object ready to be signed and executed
 */
export function buildResolveTx(
  marketId: string,
  adminCapId: string,
  winner: 1 | 2
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${CUSTOM_MARKET_PACKAGE}::market::resolve`,
    arguments: [
      tx.object(marketId),
      tx.object(adminCapId),
      tx.pure.u8(winner),
    ],
  });

  return tx;
}

/**
 * Builds a transaction for a user to claim their winnings if YES won.
 * 
 * @param marketId The object ID of the shared Market object
 * @param yesTokenId The object ID of the user's YES token Coin
 * @param userAddress The address to send the SUI payout to
 * @returns A Transaction object ready to be signed and executed
 */
export function buildClaimYesTx(
  marketId: string,
  yesTokenId: string,
  userAddress: string
): Transaction {
  const tx = new Transaction();

  const payout = tx.moveCall({
    target: `${CUSTOM_MARKET_PACKAGE}::market::claim_yes`,
    arguments: [tx.object(marketId), tx.object(yesTokenId)],
  });

  tx.transferObjects([payout], tx.pure.address(userAddress));

  return tx;
}

/**
 * Builds a transaction for a user to claim their winnings if NO won.
 * 
 * @param marketId The object ID of the shared Market object
 * @param noTokenId The object ID of the user's NO token Coin
 * @param userAddress The address to send the SUI payout to
 * @returns A Transaction object ready to be signed and executed
 */
export function buildClaimNoTx(
  marketId: string,
  noTokenId: string,
  userAddress: string
): Transaction {
  const tx = new Transaction();

  const payout = tx.moveCall({
    target: `${CUSTOM_MARKET_PACKAGE}::market::claim_no`,
    arguments: [tx.object(marketId), tx.object(noTokenId)],
  });

  tx.transferObjects([payout], tx.pure.address(userAddress));

  return tx;
}
