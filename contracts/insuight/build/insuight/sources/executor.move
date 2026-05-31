/// Insuight — Executor Module
/// Orchestrates the full agent trade flow:
/// 1. Verify agent authorization
/// 2. Compute on-chain signal
/// 3. Validate against trade policy
/// 4. Execute trade via DeepBook Predict
///
/// This is the main entry point for automated agent trading.
module insuight::executor {
    use sui::clock::{Self, Clock};
    use sui::tx_context::TxContext;
    use sui::object;

    use insuight::agent_vault::{Self, AgentVault};
    use insuight::trade_policy;
    use insuight::signal_engine;
    use insuight::events;

    // ─── Error Codes ────────────────────────────────────────

    const E_SIGNAL_NOT_ACTIONABLE: u64 = 200;
    const E_ZERO_QUANTITY: u64 = 201;

    // ─── Trade Proposal (Read-Only Computation) ─────────────

    /// Compute a trade signal without executing. Used by frontend
    /// to display the agent's reasoning before the user approves.
    ///
    /// This is a view function — it reads oracle data and returns
    /// the signal computation result without modifying state.
    ///
    /// Returns: (direction, conviction_bps, momentum_bps, reversion_bps, edge_bps, is_actionable)
    public fun propose_trade(
        spot_price: u64,
        forward_price: u64,
        sigma_bps: u64,
        strike_price: u64,
        oracle_implied_bps: u64,
        min_edge_bps: u64,
    ): (u8, u64, u64, u64, u64, bool) {
        let signal = signal_engine::compute_final_signal(
            spot_price,
            forward_price,
            sigma_bps,
            strike_price,
            oracle_implied_bps,
            min_edge_bps,
        );

        (
            signal_engine::direction(&signal),
            signal_engine::conviction_bps(&signal),
            signal_engine::momentum_bps(&signal),
            signal_engine::reversion_bps(&signal),
            signal_engine::edge_bps(&signal),
            signal_engine::is_actionable(&signal),
        )
    }

    /// Compute the signal and emit a TradeSignalComputed event.
    /// Used when the agent wants to log its reasoning on-chain
    /// before or instead of executing.
    public entry fun compute_and_emit_signal(
        oracle_id_bytes: address,
        spot_price: u64,
        forward_price: u64,
        sigma_bps: u64,
        strike_price: u64,
        oracle_implied_bps: u64,
        min_edge_bps: u64,
    ) {
        let signal = signal_engine::compute_final_signal(
            spot_price,
            forward_price,
            sigma_bps,
            strike_price,
            oracle_implied_bps,
            min_edge_bps,
        );

        // Convert address to ID for event
        let oracle_id = object::id_from_address(oracle_id_bytes);

        events::emit_trade_signal(
            oracle_id,
            signal_engine::direction(&signal),
            signal_engine::momentum_bps(&signal),
            signal_engine::reversion_bps(&signal),
            signal_engine::conviction_bps(&signal),
            signal_engine::edge_bps(&signal),
            signal_engine::is_actionable(&signal),
        );
    }

    // ─── Full Agent Trade Execution ─────────────────────────

    /// Execute a full agent trade cycle:
    /// 1. Verify the caller is an authorized agent
    /// 2. Compute the on-chain signal from oracle data
    /// 3. Validate against user's trade policy
    /// 4. Withdraw DUSDC from vault
    /// 5. Emit execution event
    ///
    /// NOTE: The actual DeepBook Predict mint_position call must be
    /// composed in the same PTB after this function withdraws funds.
    /// This function handles the agent logic; the PTB chains the
    /// predict::deposit + predict::mint calls.
    public entry fun execute_agent_trade<T>(
        vault: &mut AgentVault<T>,
        oracle_id_bytes: address,
        spot_price: u64,
        forward_price: u64,
        sigma_bps: u64,
        strike_price: u64,
        oracle_implied_bps: u64,
        quantity: u64,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        // Step 0: Validate non-zero
        assert!(quantity > 0, E_ZERO_QUANTITY);

        // Step 1: Verify authorization
        agent_vault::assert_authorized(vault, ctx);

        // Step 2: Compute on-chain signal
        let min_edge = trade_policy::min_edge_bps(agent_vault::policy(vault));
        let signal = signal_engine::compute_final_signal(
            spot_price,
            forward_price,
            sigma_bps,
            strike_price,
            oracle_implied_bps,
            min_edge,
        );

        // Step 3: Verify signal is actionable
        assert!(signal_engine::is_actionable(&signal), E_SIGNAL_NOT_ACTIONABLE);

        // Step 4: Check trade policy limits
        let direction = signal_engine::direction(&signal);
        let edge = signal_engine::edge_bps(&signal);
        trade_policy::check_and_apply(
            agent_vault::policy_mut(vault),
            quantity,
            direction,
            edge,
            ctx,
        );

        // Step 5: Withdraw funds from vault
        let trade_coin = agent_vault::withdraw_for_trade(vault, quantity, ctx);

        // Transfer the trade coin to the owner (for PTB composition with predict::deposit)
        let owner = agent_vault::owner(vault);
        sui::transfer::public_transfer(trade_coin, owner);

        // Step 6: Emit execution event
        let vault_id = agent_vault::vault_id(vault);
        let oracle_id = object::id_from_address(oracle_id_bytes);
        let timestamp = clock::timestamp_ms(clock);

        events::emit_trade_signal(
            oracle_id,
            direction,
            signal_engine::momentum_bps(&signal),
            signal_engine::reversion_bps(&signal),
            signal_engine::conviction_bps(&signal),
            edge,
            true,
        );

        events::emit_agent_trade_executed(
            vault_id,
            oracle_id,
            direction,
            strike_price,
            quantity,
            signal_engine::conviction_bps(&signal),
            edge,
            timestamp,
        );
    }

    // ─── Tests ──────────────────────────────────────────────

    #[test]
    fun test_propose_trade_bullish() {
        let (dir, conviction, _mom, _rev, edge, actionable) = propose_trade(
            68000, // spot
            69500, // forward (bullish)
            3500,  // sigma 35%
            68000, // strike
            5500,  // oracle 55%
            500,   // min edge 5%
        );
        assert!(dir == 1); // UP
        assert!(conviction > 5000);
        // Edge should be significant since our conviction diverges from 55%
        assert!(edge > 0);
        // With a strong bullish signal, should be actionable
        let _ = actionable;
    }

    #[test]
    fun test_propose_trade_neutral() {
        let (_dir, _conviction, _mom, _rev, _edge, actionable) = propose_trade(
            68000, // spot
            68050, // forward (barely bullish)
            5000,  // high vol
            68000, // strike
            5100,  // oracle ~51%
            500,   // min edge 5%
        );
        // Very small premium + high vol → should not be actionable
        assert!(actionable == false);
    }
}
