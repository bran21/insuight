/**
 * Insuight — DeepBook Predict Server API Client
 * Wraps: https://predict-server.testnet.mystenlabs.com
 */

import { PREDICT_SERVER, PREDICT_OBJECT } from '../constants';

// ─── Types ──────────────────────────────────────────────────

export interface OracleState {
  oracle_id: string;
  name: string;
  spot: number;
  forward: number;
  expiry: number;
  expiry_date: string;
  status: 'inactive' | 'active' | 'pending_settlement' | 'settled';
  settlement_price?: number;
  svi?: {
    a: number;
    b: number;
    rho: number;
    m: number;
    sigma: number;
  };
}

export interface PredictState {
  predict_id: string;
  oracles: OracleState[];
  vault_balance: number;
  total_plp_supply: number;
  quote_assets: string[];
}

export interface ManagerSummary {
  manager_id: string;
  owner: string;
  balances: Record<string, number>;
  positions_count: number;
  ranges_count: number;
}

export interface PositionSummary {
  oracle_id: string;
  expiry: number;
  strike: number;
  is_up: boolean;
  quantity: number;
  entry_price: number;
  current_price: number;
  pnl: number;
}

export interface VaultSummary {
  total_value: number;
  plp_supply: number;
  plp_price: number;
  max_payout: number;
  utilization: number;
}

export interface PricePoint {
  timestamp: number;
  spot: number;
  forward: number;
}

// ─── API Functions ──────────────────────────────────────────

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${PREDICT_SERVER}${path}`);
  if (!res.ok) throw new Error(`Predict API ${path}: ${res.status}`);
  return res.json();
}

/** Server health check */
export async function getStatus(): Promise<{ status: string }> {
  return fetchJSON('/status');
}

/** Full market state */
export async function getPredictState(): Promise<PredictState> {
  return fetchJSON(`/predicts/${PREDICT_OBJECT}/state`);
}

/** All active oracles */
export async function getOracles(): Promise<OracleState[]> {
  return fetchJSON(`/predicts/${PREDICT_OBJECT}/oracles`);
}

/** Single oracle state */
export async function getOracleState(oracleId: string): Promise<OracleState> {
  return fetchJSON(`/oracles/${oracleId}/state`);
}

/** Oracle ask bounds (strike price limits) */
export async function getOracleAskBounds(oracleId: string) {
  return fetchJSON(`/oracles/${oracleId}/ask-bounds`);
}

/** Accepted quote assets */
export async function getQuoteAssets(): Promise<string[]> {
  return fetchJSON(`/predicts/${PREDICT_OBJECT}/quote-assets`);
}

/** Vault summary */
export async function getVaultSummary(): Promise<VaultSummary> {
  return fetchJSON(`/predicts/${PREDICT_OBJECT}/vault/summary`);
}

/** Vault performance */
export async function getVaultPerformance(range: string = 'ALL') {
  return fetchJSON(`/predicts/${PREDICT_OBJECT}/vault/performance?range=${range}`);
}

/** Get all managers */
export async function getManagers() {
  return fetchJSON('/managers');
}

/** Manager summary */
export async function getManagerSummary(managerId: string): Promise<ManagerSummary> {
  return fetchJSON(`/managers/${managerId}/summary`);
}

/** Manager positions */
export async function getManagerPositions(managerId: string): Promise<PositionSummary[]> {
  return fetchJSON(`/managers/${managerId}/positions/summary`);
}

/** Manager PnL */
export async function getManagerPnL(managerId: string, range: string = 'ALL') {
  return fetchJSON(`/managers/${managerId}/pnl?range=${range}`);
}

/** Oracle price history */
export async function getOraclePrices(oracleId: string): Promise<PricePoint[]> {
  return fetchJSON(`/oracles/${oracleId}/prices`);
}

/** Latest oracle price */
export async function getOracleLatestPrice(oracleId: string) {
  return fetchJSON(`/oracles/${oracleId}/prices/latest`);
}

/** SVI parameter history */
export async function getOracleSVI(oracleId: string) {
  return fetchJSON(`/oracles/${oracleId}/svi`);
}

/** Trade history */
export async function getTrades(oracleId: string) {
  return fetchJSON(`/trades/${oracleId}`);
}

/** Minted positions */
export async function getMintedPositions() {
  return fetchJSON('/positions/minted');
}

/** Redeemed positions */
export async function getRedeemedPositions() {
  return fetchJSON('/positions/redeemed');
}
