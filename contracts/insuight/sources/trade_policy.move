/// Insuight — Trade Policy Module
/// User-configurable risk guardrails that the agent must respect.
/// All limits are enforced on-chain — the agent cannot bypass them.
module insuight::trade_policy {
    use sui::tx_context::TxContext;

    // ─── Error Codes ────────────────────────────────────────

    const E_MAX_TRADE_SIZE_EXCEEDED: u64 = 1;
    const E_DAILY_SPEND_LIMIT_EXCEEDED: u64 = 2;
    const E_MIN_EDGE_NOT_MET: u64 = 3;
    const E_DIRECTION_NOT_ALLOWED: u64 = 4;

    // ─── Direction Constants ────────────────────────────────

    const DIRECTION_DOWN: u8 = 0;
    const DIRECTION_UP: u8 = 1;
    const ALLOW_UP_ONLY: u8 = 1;
    const ALLOW_DOWN_ONLY: u8 = 2;
    const ALLOW_BOTH: u8 = 3;

    // ─── Struct ─────────────────────────────────────────────

    /// Risk parameters that constrain agent behavior.
    /// Stored inside the AgentVault.
    public struct TradePolicy has store, drop {
        /// Maximum DUSDC quantity per single trade (6 decimal precision)
        max_trade_size: u64,
        /// Maximum DUSDC the agent can spend per epoch-day
        max_daily_spend: u64,
        /// Amount spent so far in the current epoch-day
        spent_today: u64,
        /// Epoch at which spent_today was last reset
        last_reset_epoch: u64,
        /// Minimum edge in basis points before a trade is allowed (500 = 5%)
        min_edge_bps: u64,
        /// Which directions are allowed: 1=UP, 2=DOWN, 3=BOTH
        allowed_directions: u8,
    }

    // ─── Constructor ────────────────────────────────────────

    /// Create a default policy with reasonable limits.
    public fun default(): TradePolicy {
        TradePolicy {
            max_trade_size: 100_000_000,    // 100 DUSDC (6 decimals)
            max_daily_spend: 500_000_000,   // 500 DUSDC daily cap
            spent_today: 0,
            last_reset_epoch: 0,
            min_edge_bps: 500,              // 5% minimum edge
            allowed_directions: ALLOW_BOTH,
        }
    }

    /// Create a custom policy.
    public fun new(
        max_trade_size: u64,
        max_daily_spend: u64,
        min_edge_bps: u64,
        allowed_directions: u8,
    ): TradePolicy {
        TradePolicy {
            max_trade_size,
            max_daily_spend,
            spent_today: 0,
            last_reset_epoch: 0,
            min_edge_bps,
            allowed_directions,
        }
    }

    // ─── Core Validation ────────────────────────────────────

    /// Validate a proposed trade against all policy limits.
    /// If valid, updates the daily spend counter.
    /// Aborts with specific error code if any limit is violated.
    public fun check_and_apply(
        policy: &mut TradePolicy,
        quantity: u64,
        direction: u8,
        edge_bps: u64,
        ctx: &TxContext,
    ) {
        // Reset daily counter if epoch has changed
        let current_epoch = sui::tx_context::epoch(ctx);
        if (current_epoch > policy.last_reset_epoch) {
            policy.spent_today = 0;
            policy.last_reset_epoch = current_epoch;
        };

        // Check 1: Max trade size
        assert!(quantity <= policy.max_trade_size, E_MAX_TRADE_SIZE_EXCEEDED);

        // Check 2: Daily spend limit
        assert!(
            policy.spent_today + quantity <= policy.max_daily_spend,
            E_DAILY_SPEND_LIMIT_EXCEEDED
        );

        // Check 3: Minimum edge threshold
        assert!(edge_bps >= policy.min_edge_bps, E_MIN_EDGE_NOT_MET);

        // Check 4: Direction allowed
        if (direction == DIRECTION_UP) {
            assert!(
                policy.allowed_directions == ALLOW_UP_ONLY || policy.allowed_directions == ALLOW_BOTH,
                E_DIRECTION_NOT_ALLOWED
            );
        } else {
            assert!(
                policy.allowed_directions == ALLOW_DOWN_ONLY || policy.allowed_directions == ALLOW_BOTH,
                E_DIRECTION_NOT_ALLOWED
            );
        };

        // All checks passed — update daily spend
        policy.spent_today = policy.spent_today + quantity;
    }

    // ─── Admin Functions ────────────────────────────────────

    /// Update policy parameters. Only callable by vault owner (enforced at vault level).
    public fun update(
        policy: &mut TradePolicy,
        max_trade_size: u64,
        max_daily_spend: u64,
        min_edge_bps: u64,
        allowed_directions: u8,
    ) {
        policy.max_trade_size = max_trade_size;
        policy.max_daily_spend = max_daily_spend;
        policy.min_edge_bps = min_edge_bps;
        policy.allowed_directions = allowed_directions;
    }

    // ─── Readers ────────────────────────────────────────────

    public fun max_trade_size(policy: &TradePolicy): u64 { policy.max_trade_size }
    public fun max_daily_spend(policy: &TradePolicy): u64 { policy.max_daily_spend }
    public fun spent_today(policy: &TradePolicy): u64 { policy.spent_today }
    public fun min_edge_bps(policy: &TradePolicy): u64 { policy.min_edge_bps }
    public fun allowed_directions(policy: &TradePolicy): u8 { policy.allowed_directions }
    public fun remaining_daily(policy: &TradePolicy): u64 {
        if (policy.max_daily_spend > policy.spent_today) {
            policy.max_daily_spend - policy.spent_today
        } else {
            0
        }
    }

    // ─── Tests ──────────────────────────────────────────────

    #[test]
    fun test_default_policy() {
        let policy = default();
        assert!(policy.max_trade_size == 100_000_000);
        assert!(policy.min_edge_bps == 500);
        assert!(policy.allowed_directions == 3);
    }
}
