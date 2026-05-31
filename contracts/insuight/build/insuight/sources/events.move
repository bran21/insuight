/// Insuight — On-Chain Event Definitions
/// Provides full audit trail for every agent action.
module insuight::events {
    use sui::event;

    // ─── Vault Events ───────────────────────────────────────

    public struct VaultCreated has copy, drop {
        vault_id: ID,
        owner: address,
        agent: address,
    }

    public struct VaultDeposit has copy, drop {
        vault_id: ID,
        amount: u64,
    }

    public struct VaultWithdraw has copy, drop {
        vault_id: ID,
        amount: u64,
    }

    public struct AgentAuthorized has copy, drop {
        vault_id: ID,
        agent: address,
    }

    public struct AgentRevoked has copy, drop {
        vault_id: ID,
        old_agent: address,
    }

    // ─── Signal Events ──────────────────────────────────────

    public struct TradeSignalComputed has copy, drop {
        oracle_id: ID,
        /// 1 = UP, 0 = DOWN
        direction: u8,
        momentum_score_bps: u64,
        reversion_score_bps: u64,
        final_conviction_bps: u64,
        edge_bps: u64,
        is_actionable: bool,
    }

    // ─── Trade Events ───────────────────────────────────────

    public struct AgentTradeExecuted has copy, drop {
        vault_id: ID,
        oracle_id: ID,
        direction: u8,
        strike: u64,
        quantity: u64,
        conviction_bps: u64,
        edge_bps: u64,
        timestamp_ms: u64,
    }

    public struct PolicyViolation has copy, drop {
        vault_id: ID,
        /// 1=max_trade_size, 2=daily_limit, 3=min_edge, 4=direction_blocked
        reason: u8,
    }

    // ─── Emitter Functions ──────────────────────────────────

    public fun emit_vault_created(vault_id: ID, owner: address, agent: address) {
        event::emit(VaultCreated { vault_id, owner, agent });
    }

    public fun emit_vault_deposit(vault_id: ID, amount: u64) {
        event::emit(VaultDeposit { vault_id, amount });
    }

    public fun emit_vault_withdraw(vault_id: ID, amount: u64) {
        event::emit(VaultWithdraw { vault_id, amount });
    }

    public fun emit_agent_authorized(vault_id: ID, agent: address) {
        event::emit(AgentAuthorized { vault_id, agent });
    }

    public fun emit_agent_revoked(vault_id: ID, old_agent: address) {
        event::emit(AgentRevoked { vault_id, old_agent });
    }

    public fun emit_trade_signal(
        oracle_id: ID,
        direction: u8,
        momentum_score_bps: u64,
        reversion_score_bps: u64,
        final_conviction_bps: u64,
        edge_bps: u64,
        is_actionable: bool,
    ) {
        event::emit(TradeSignalComputed {
            oracle_id,
            direction,
            momentum_score_bps,
            reversion_score_bps,
            final_conviction_bps,
            edge_bps,
            is_actionable,
        });
    }

    public fun emit_agent_trade_executed(
        vault_id: ID,
        oracle_id: ID,
        direction: u8,
        strike: u64,
        quantity: u64,
        conviction_bps: u64,
        edge_bps: u64,
        timestamp_ms: u64,
    ) {
        event::emit(AgentTradeExecuted {
            vault_id,
            oracle_id,
            direction,
            strike,
            quantity,
            conviction_bps,
            edge_bps,
            timestamp_ms,
        });
    }

    public fun emit_policy_violation(vault_id: ID, reason: u8) {
        event::emit(PolicyViolation { vault_id, reason });
    }
}
