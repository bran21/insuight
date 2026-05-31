/**
 * Insuight — DeepBook Predict PTB Builder
 * Constructs Programmable Transaction Blocks for Predict operations
 */

import { Transaction } from '@mysten/sui/transactions';
import { PREDICT_PACKAGE, PREDICT_OBJECT, DUSDC_TYPE } from '../constants';

/**
 * Create a new PredictManager for the user
 */
export function buildCreateManager(tx: Transaction): Transaction {
  tx.moveCall({
    target: `${PREDICT_PACKAGE}::predict::create_manager`,
    arguments: [],
  });
  return tx;
}

/**
 * Deposit DUSDC into PredictManager
 */
export function buildDeposit(
  tx: Transaction,
  managerId: string,
  coinObjectId: string,
): Transaction {
  tx.moveCall({
    target: `${PREDICT_PACKAGE}::predict::deposit`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(managerId),
      tx.object(coinObjectId),
    ],
  });
  return tx;
}

/**
 * Withdraw DUSDC from PredictManager
 */
export function buildWithdraw(
  tx: Transaction,
  managerId: string,
  amount: bigint,
  recipientAddress: string,
): Transaction {
  const coin = tx.moveCall({
    target: `${PREDICT_PACKAGE}::predict::withdraw`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(managerId),
      tx.pure.u64(amount),
    ],
  });
  tx.transferObjects([coin], recipientAddress);
  return tx;
}

/**
 * Mint a binary position (UP or DOWN)
 */
export function buildMintPosition(
  tx: Transaction,
  managerId: string,
  oracleId: string,
  expiry: bigint,
  strike: bigint,
  isUp: boolean,
  quantity: bigint,
): Transaction {
  tx.moveCall({
    target: `${PREDICT_PACKAGE}::predict::mint_position`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(PREDICT_OBJECT),
      tx.object(managerId),
      tx.object(oracleId),
      tx.pure.u64(expiry),
      tx.pure.u64(strike),
      tx.pure.bool(isUp),
      tx.pure.u64(quantity),
    ],
  });
  return tx;
}

/**
 * Redeem a binary position
 */
export function buildRedeemPosition(
  tx: Transaction,
  managerId: string,
  oracleId: string,
  expiry: bigint,
  strike: bigint,
  isUp: boolean,
  quantity: bigint,
): Transaction {
  tx.moveCall({
    target: `${PREDICT_PACKAGE}::predict::redeem_position`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(PREDICT_OBJECT),
      tx.object(managerId),
      tx.object(oracleId),
      tx.pure.u64(expiry),
      tx.pure.u64(strike),
      tx.pure.bool(isUp),
      tx.pure.u64(quantity),
    ],
  });
  return tx;
}

/**
 * Supply DUSDC to vault (become LP, receive PLP)
 */
export function buildSupplyLiquidity(
  tx: Transaction,
  managerId: string,
  coinObjectId: string,
): Transaction {
  tx.moveCall({
    target: `${PREDICT_PACKAGE}::predict::supply`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(PREDICT_OBJECT),
      tx.object(managerId),
      tx.object(coinObjectId),
    ],
  });
  return tx;
}
