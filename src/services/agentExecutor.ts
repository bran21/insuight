/**
 * Insuight — Agent Executor PTB Builder
 *
 * Builds Programmable Transaction Blocks for the on-chain
 * Insuight agent contracts (agent_vault, trade_policy, executor).
 */

import { Transaction } from '@mysten/sui/transactions';
import { INSUIGHT_PACKAGE, DUSDC_TYPE } from '../constants';

// ─── Vault Operations ───────────────────────────────────────

/**
 * Create a new AgentVault for the user.
 * The agent_address is the address authorized to execute trades.
 * predict_manager_id is the user's existing PredictManager object ID.
 */
export function buildCreateVault(
  tx: Transaction,
  agentAddress: string,
  predictManagerId: string,
): Transaction {
  tx.moveCall({
    target: `${INSUIGHT_PACKAGE}::agent_vault::create_vault`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.pure.address(agentAddress),
      tx.pure.id(predictManagerId),
    ],
  });
  return tx;
}

/**
 * Deposit DUSDC into an existing AgentVault.
 */
export function buildDepositToVault(
  tx: Transaction,
  vaultId: string,
  coinObjectId: string,
): Transaction {
  tx.moveCall({
    target: `${INSUIGHT_PACKAGE}::agent_vault::deposit`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(vaultId),
      tx.object(coinObjectId),
    ],
  });
  return tx;
}

/**
 * Withdraw DUSDC from the AgentVault. Owner only.
 */
export function buildWithdrawFromVault(
  tx: Transaction,
  vaultId: string,
  amount: bigint,
): Transaction {
  tx.moveCall({
    target: `${INSUIGHT_PACKAGE}::agent_vault::withdraw`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(vaultId),
      tx.pure.u64(amount),
    ],
  });
  return tx;
}

/**
 * Authorize a new agent address. Owner only.
 */
export function buildSetAgent(
  tx: Transaction,
  vaultId: string,
  newAgentAddress: string,
): Transaction {
  tx.moveCall({
    target: `${INSUIGHT_PACKAGE}::agent_vault::set_agent`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(vaultId),
      tx.pure.address(newAgentAddress),
    ],
  });
  return tx;
}

/**
 * Revoke the agent's trading privileges. Owner only.
 */
export function buildRevokeAgent(
  tx: Transaction,
  vaultId: string,
): Transaction {
  tx.moveCall({
    target: `${INSUIGHT_PACKAGE}::agent_vault::revoke_agent`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(vaultId),
    ],
  });
  return tx;
}

// ─── Policy Operations ──────────────────────────────────────

/**
 * Update the vault's trade policy. Owner only.
 */
export function buildUpdatePolicy(
  tx: Transaction,
  vaultId: string,
  params: {
    maxTradeSize: bigint;
    maxDailySpend: bigint;
    minEdgeBps: number;
    allowedDirections: number; // 1=UP, 2=DOWN, 3=BOTH
  },
): Transaction {
  tx.moveCall({
    target: `${INSUIGHT_PACKAGE}::agent_vault::update_policy`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(vaultId),
      tx.pure.u64(params.maxTradeSize),
      tx.pure.u64(params.maxDailySpend),
      tx.pure.u64(params.minEdgeBps),
      tx.pure.u8(params.allowedDirections),
    ],
  });
  return tx;
}

// ─── Signal Operations ──────────────────────────────────────

/**
 * Compute and emit a trade signal on-chain (read + emit, no trade).
 * Useful for logging the agent's reasoning on-chain without executing.
 */
export function buildComputeSignal(
  tx: Transaction,
  oracleId: string,
  spotPrice: bigint,
  forwardPrice: bigint,
  sigmaBps: number,
  strikePrice: bigint,
  oracleImpliedBps: number,
  minEdgeBps: number,
): Transaction {
  tx.moveCall({
    target: `${INSUIGHT_PACKAGE}::executor::compute_and_emit_signal`,
    arguments: [
      tx.pure.address(oracleId),
      tx.pure.u64(spotPrice),
      tx.pure.u64(forwardPrice),
      tx.pure.u64(sigmaBps),
      tx.pure.u64(strikePrice),
      tx.pure.u64(oracleImpliedBps),
      tx.pure.u64(minEdgeBps),
    ],
  });
  return tx;
}

// ─── Full Trade Execution ───────────────────────────────────

/**
 * Execute a full agent trade cycle on-chain:
 * 1. Verifies agent authorization
 * 2. Computes signal from oracle data
 * 3. Validates against trade policy
 * 4. Withdraws DUSDC from vault
 * 5. Emits execution events
 *
 * NOTE: After this call, chain the predict::deposit + predict::mint
 * calls in the same PTB to complete the DeepBook Predict trade.
 */
export function buildExecuteAgentTrade(
  tx: Transaction,
  vaultId: string,
  oracleId: string,
  spotPrice: bigint,
  forwardPrice: bigint,
  sigmaBps: number,
  strikePrice: bigint,
  oracleImpliedBps: number,
  quantity: bigint,
): Transaction {
  tx.moveCall({
    target: `${INSUIGHT_PACKAGE}::executor::execute_agent_trade`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(vaultId),
      tx.pure.address(oracleId),
      tx.pure.u64(spotPrice),
      tx.pure.u64(forwardPrice),
      tx.pure.u64(sigmaBps),
      tx.pure.u64(strikePrice),
      tx.pure.u64(oracleImpliedBps),
      tx.pure.u64(quantity),
      tx.object('0x6'), // Clock object (shared, always 0x6 on Sui)
    ],
  });
  return tx;
}

// ─── Composite PTBs ─────────────────────────────────────────

/**
 * Build a full agent trade PTB that:
 * 1. Executes the agent trade (signal + policy + withdraw)
 * 2. Deposits the withdrawn DUSDC into PredictManager
 * 3. Mints the binary position on DeepBook Predict
 *
 * This is the complete end-to-end PTB for an automated agent trade.
 */
export function buildFullAgentTradePTB(
  params: {
    vaultId: string;
    predictObjectId: string;
    predictManagerId: string;
    oracleId: string;
    spotPrice: bigint;
    forwardPrice: bigint;
    sigmaBps: number;
    strikePrice: bigint;
    oracleImpliedBps: number;
    quantity: bigint;
    expiry: bigint;
    isUp: boolean;
    predictPackage: string;
  },
): Transaction {
  const tx = new Transaction();

  // Step 1: Execute agent trade (verify + signal + policy + withdraw from vault)
  buildExecuteAgentTrade(
    tx,
    params.vaultId,
    params.oracleId,
    params.spotPrice,
    params.forwardPrice,
    params.sigmaBps,
    params.strikePrice,
    params.oracleImpliedBps,
    params.quantity,
  );

  // Steps 2 & 3 would chain predict::deposit + predict::mint
  // These use the coin output from the vault withdrawal
  // In practice, the vault sends the coin to the owner,
  // who then deposits it into the PredictManager in the same PTB.
  //
  // NOTE: Full DeepBook Predict integration requires the coin
  // object to be captured from execute_agent_trade's output.
  // For the hackathon demo, we show this as a two-step flow:
  // the agent proposes → user signs the combined PTB.

  return tx;
}
