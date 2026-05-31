/// Insuight — Signal Engine Module
/// The core "AI brain" — deterministic on-chain trading algorithms.
/// Uses pure math to analyze oracle data and generate trade signals.
/// No LLM, no off-chain dependency. Fully verifiable on-chain.
module insuight::signal_engine {

    // ─── Constants ──────────────────────────────────────────

    /// Basis point denominator (10000 = 100%)
    const BPS_DENOMINATOR: u64 = 10000;

    /// Direction constants
    const DIRECTION_DOWN: u8 = 0;
    const DIRECTION_UP: u8 = 1;

    /// Strategy weight for momentum (60% = 6000 bps)
    const MOMENTUM_WEIGHT_BPS: u64 = 6000;
    /// Strategy weight for mean reversion (40% = 4000 bps)
    const REVERSION_WEIGHT_BPS: u64 = 4000;

    /// Minimum sigma (vol) to prevent division by zero (1% = 100 bps)
    const MIN_SIGMA_BPS: u64 = 100;

    /// Mean reversion activation threshold (3% deviation = 300 bps)
    const REVERSION_THRESHOLD_BPS: u64 = 300;

    /// Maximum conviction clamp (95% = 9500 bps)
    const MAX_CONVICTION_BPS: u64 = 9500;
    /// Minimum conviction clamp (5% = 500 bps)
    const MIN_CONVICTION_BPS: u64 = 500;

    // ─── Signal Output ──────────────────────────────────────

    /// Result of the signal computation.
    public struct TradeSignal has copy, drop {
        direction: u8,
        conviction_bps: u64,
        momentum_bps: u64,
        reversion_bps: u64,
        edge_bps: u64,
        is_actionable: bool,
    }

    // ─── Strategy 1: Momentum Scoring ───────────────────────

    /// Measures spot-to-forward premium as a directional signal.
    /// Forward > Spot = bullish momentum → UP.
    /// Adjusts conviction by volatility: higher σ → lower conviction.
    ///
    /// All prices in same units (e.g., cents or scaled u64).
    /// sigma_bps: SVI volatility in basis points (4200 = 42%).
    ///
    /// Returns: (direction, conviction_bps)
    public fun compute_momentum_signal(
        spot_price: u64,
        forward_price: u64,
        sigma_bps: u64,
    ): (u8, u64) {
        // Guard against zero
        if (spot_price == 0) {
            return (DIRECTION_UP, 5000) // neutral 50%
        };

        // Compute premium ratio in basis points
        // premium_bps = ((forward - spot) / spot) * 10000
        let direction: u8;
        let premium_bps: u64;

        if (forward_price >= spot_price) {
            direction = DIRECTION_UP;
            premium_bps = ((forward_price - spot_price) * BPS_DENOMINATOR) / spot_price;
        } else {
            direction = DIRECTION_DOWN;
            premium_bps = ((spot_price - forward_price) * BPS_DENOMINATOR) / spot_price;
        };

        // Convert premium to conviction:
        // Raw conviction = 5000 (neutral) + premium_bps * 10
        // This maps a 1% premium to +100 bps conviction above neutral
        let raw_conviction = 5000 + (premium_bps * 10);

        // Volatility adjustment: high vol → dampen conviction toward 5000
        // vol_dampener = min_sigma / actual_sigma (range 0..1 in bps)
        let effective_sigma = if (sigma_bps > MIN_SIGMA_BPS) { sigma_bps } else { MIN_SIGMA_BPS };
        // Scale factor: lower vol = higher confidence multiplier
        // dampened_conviction = 5000 + (raw - 5000) * (3000 / sigma_bps)
        // At sigma=30% (3000 bps): no dampening
        // At sigma=60% (6000 bps): conviction halved from neutral
        let deviation_from_neutral = if (raw_conviction > 5000) {
            raw_conviction - 5000
        } else {
            5000 - raw_conviction
        };

        let vol_scale = if (effective_sigma > 0) {
            (3000 * BPS_DENOMINATOR) / effective_sigma
        } else {
            BPS_DENOMINATOR
        };

        let adjusted_deviation = (deviation_from_neutral * vol_scale) / BPS_DENOMINATOR;
        let conviction = 5000 + adjusted_deviation;

        // Clamp to bounds
        let clamped = clamp(conviction, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS);

        (direction, clamped)
    }

    // ─── Strategy 2: Mean Reversion ─────────────────────────

    /// When spot deviates significantly from a reference strike,
    /// predicts reversion toward the strike price.
    /// Bigger deviation = stronger signal.
    ///
    /// Returns: (direction, conviction_bps)
    public fun compute_reversion_signal(
        spot_price: u64,
        forward_price: u64,
        strike_price: u64,
    ): (u8, u64) {
        if (strike_price == 0 || spot_price == 0) {
            return (DIRECTION_UP, 5000) // neutral
        };

        // Use forward as the reference, falling back to spot
        let reference = if (forward_price > 0) { forward_price } else { spot_price };

        // Compute deviation from strike in bps
        let direction: u8;
        let deviation_bps: u64;

        if (reference > strike_price) {
            // Price above strike → expect reversion DOWN
            direction = DIRECTION_DOWN;
            deviation_bps = ((reference - strike_price) * BPS_DENOMINATOR) / strike_price;
        } else {
            // Price below strike → expect reversion UP
            direction = DIRECTION_UP;
            deviation_bps = ((strike_price - reference) * BPS_DENOMINATOR) / strike_price;
        };

        // Only activate reversion signal if deviation exceeds threshold
        if (deviation_bps < REVERSION_THRESHOLD_BPS) {
            // Below threshold: neutral signal
            return (DIRECTION_UP, 5000)
        };

        // Conviction scales with deviation: bigger gap → stronger reversion signal
        // conviction = 5000 + deviation_bps * 5 (a 5% deviation → 2500 bps above neutral)
        let raw_conviction = 5000 + (deviation_bps * 5);
        let clamped = clamp(raw_conviction, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS);

        (direction, clamped)
    }

    // ─── Edge Calculation ───────────────────────────────────

    /// Compute the edge between AI conviction and oracle implied probability.
    ///
    /// ai_conviction_bps: Our signal's conviction (e.g., 7200 = 72%)
    /// oracle_implied_bps: Market implied probability from oracle pricing
    /// min_edge_bps: Policy threshold for actionable edge
    ///
    /// Returns: (edge_bps, is_actionable)
    public fun compute_edge(
        ai_conviction_bps: u64,
        oracle_implied_bps: u64,
        min_edge_bps: u64,
    ): (u64, bool) {
        let edge_bps = if (ai_conviction_bps > oracle_implied_bps) {
            ai_conviction_bps - oracle_implied_bps
        } else {
            oracle_implied_bps - ai_conviction_bps
        };

        let is_actionable = edge_bps >= min_edge_bps;

        (edge_bps, is_actionable)
    }

    // ─── Ensemble Combiner ──────────────────────────────────

    /// Combines momentum and reversion signals into a single trade signal.
    ///
    /// Parameters mirror oracle state:
    ///   spot_price, forward_price: from OracleSVI
    ///   sigma_bps: SVI sigma * 10000
    ///   strike_price: the strike we're evaluating
    ///   oracle_implied_bps: oracle's implied probability for this strike
    ///   min_edge_bps: from user's TradePolicy
    ///
    /// Returns a TradeSignal with full breakdown.
    public fun compute_final_signal(
        spot_price: u64,
        forward_price: u64,
        sigma_bps: u64,
        strike_price: u64,
        oracle_implied_bps: u64,
        min_edge_bps: u64,
    ): TradeSignal {
        // Strategy 1: Momentum
        let (mom_direction, mom_conviction) = compute_momentum_signal(
            spot_price, forward_price, sigma_bps
        );

        // Strategy 2: Mean Reversion
        let (rev_direction, rev_conviction) = compute_reversion_signal(
            spot_price, forward_price, strike_price
        );

        // Weighted ensemble
        // If both agree on direction: weighted average of convictions
        // If they disagree: use the stronger signal's direction, reduce conviction
        let mut final_direction: u8;
        let mut final_conviction: u64;

        if (mom_direction == rev_direction) {
            // Agreement: weight and combine
            final_direction = mom_direction;
            final_conviction = (mom_conviction * MOMENTUM_WEIGHT_BPS + rev_conviction * REVERSION_WEIGHT_BPS)
                / BPS_DENOMINATOR;
        } else {
            // Disagreement: use momentum direction (higher weight), penalize conviction
            final_direction = mom_direction;
            // Reduce conviction toward neutral when strategies disagree
            let mom_deviation = if (mom_conviction > 5000) { mom_conviction - 5000 } else { 5000 - mom_conviction };
            let rev_deviation = if (rev_conviction > 5000) { rev_conviction - 5000 } else { 5000 - rev_conviction };

            if (mom_deviation > rev_deviation) {
                // Momentum is stronger: use it but dampen
                final_conviction = 5000 + (mom_deviation - rev_deviation) / 2;
            } else {
                // Reversion is stronger: flip to reversion direction
                final_direction = rev_direction;
                final_conviction = 5000 + (rev_deviation - mom_deviation) / 2;
            };
        };

        // Clamp final conviction
        final_conviction = clamp(final_conviction, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS);

        // Compute edge vs oracle
        let (edge_bps, is_actionable) = compute_edge(
            final_conviction, oracle_implied_bps, min_edge_bps
        );

        TradeSignal {
            direction: final_direction,
            conviction_bps: final_conviction,
            momentum_bps: mom_conviction,
            reversion_bps: rev_conviction,
            edge_bps,
            is_actionable,
        }
    }

    // ─── Readers ────────────────────────────────────────────

    public fun direction(signal: &TradeSignal): u8 { signal.direction }
    public fun conviction_bps(signal: &TradeSignal): u64 { signal.conviction_bps }
    public fun momentum_bps(signal: &TradeSignal): u64 { signal.momentum_bps }
    public fun reversion_bps(signal: &TradeSignal): u64 { signal.reversion_bps }
    public fun edge_bps(signal: &TradeSignal): u64 { signal.edge_bps }
    public fun is_actionable(signal: &TradeSignal): bool { signal.is_actionable }

    // ─── Helpers ────────────────────────────────────────────

    fun clamp(value: u64, min_val: u64, max_val: u64): u64 {
        if (value < min_val) {
            min_val
        } else if (value > max_val) {
            max_val
        } else {
            value
        }
    }

    /// Helper: derive implied probability from spot/forward for a given strike.
    /// Simple model: prob_up = forward / (forward + (strike - spot))
    /// Returns value in basis points.
    public fun derive_implied_probability(
        spot_price: u64,
        forward_price: u64,
        strike_price: u64,
    ): u64 {
        if (forward_price == 0 || spot_price == 0) {
            return 5000 // 50% if no data
        };

        // Simple model: if forward > strike → high prob UP
        // prob_up_bps = forward * 10000 / (forward + |strike - spot|)
        let spread = if (strike_price > spot_price) {
            strike_price - spot_price
        } else {
            spot_price - strike_price
        };

        let denominator = forward_price + spread;
        if (denominator == 0) {
            return 5000
        };

        let prob_bps = (forward_price * BPS_DENOMINATOR) / denominator;

        clamp(prob_bps, MIN_CONVICTION_BPS, MAX_CONVICTION_BPS)
    }

    // ─── Tests ──────────────────────────────────────────────

    #[test]
    fun test_momentum_bullish() {
        // Forward > Spot = bullish
        let (dir, conviction) = compute_momentum_signal(10000, 10200, 3000);
        assert!(dir == DIRECTION_UP);
        assert!(conviction > 5000); // should be bullish
    }

    #[test]
    fun test_momentum_bearish() {
        // Forward < Spot = bearish
        let (dir, _conviction) = compute_momentum_signal(10000, 9800, 3000);
        assert!(dir == DIRECTION_DOWN);
    }

    #[test]
    fun test_momentum_high_vol_dampens() {
        // Same premium but higher vol → lower conviction
        let (_dir1, conv_low_vol) = compute_momentum_signal(10000, 10200, 2000);
        let (_dir2, conv_high_vol) = compute_momentum_signal(10000, 10200, 6000);
        assert!(conv_low_vol > conv_high_vol);
    }

    #[test]
    fun test_reversion_above_strike() {
        // Price above strike → revert DOWN
        let (dir, conviction) = compute_reversion_signal(10500, 10500, 10000);
        assert!(dir == DIRECTION_DOWN);
        assert!(conviction > 5000);
    }

    #[test]
    fun test_reversion_below_threshold() {
        // Small deviation → neutral
        let (_, conviction) = compute_reversion_signal(10000, 10100, 10000);
        assert!(conviction == 5000); // within 3% threshold
    }

    #[test]
    fun test_edge_actionable() {
        let (edge, actionable) = compute_edge(7200, 5800, 500);
        assert!(edge == 1400);
        assert!(actionable == true);
    }

    #[test]
    fun test_edge_not_actionable() {
        let (edge, actionable) = compute_edge(5300, 5100, 500);
        assert!(edge == 200);
        assert!(actionable == false);
    }

    #[test]
    fun test_final_signal_integration() {
        let signal = compute_final_signal(
            68000, // spot
            69000, // forward (bullish)
            4200,  // sigma 42%
            68000, // strike
            5500,  // oracle implied 55%
            500,   // min edge 5%
        );
        assert!(signal.direction == DIRECTION_UP);
        assert!(signal.conviction_bps > 5000);
    }
}
