/// Insuight — Agent Vault Module
/// Non-custodial vault that holds user DUSDC for agent-delegated trading.
/// The user maintains full control: can deposit, withdraw, and revoke at any time.
module insuight::agent_vault {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::tx_context::TxContext;
    use sui::object::{Self, UID, ID};
    use sui::transfer;

    use insuight::trade_policy::{Self, TradePolicy};
    use insuight::events;

    // ─── Error Codes ────────────────────────────────────────

    const E_NOT_OWNER: u64 = 100;
    const E_NOT_AUTHORIZED: u64 = 101;
    const E_INSUFFICIENT_BALANCE: u64 = 102;

    // ─── DUSDC Type (Testnet) ───────────────────────────────
    // We use a generic type parameter so the vault works with any coin type.
    // In practice, it will be called with DUSDC.

    // ─── Struct ─────────────────────────────────────────────

    /// The agent vault: a shared object holding user funds for delegated trading.
    public struct AgentVault<phantom T> has key, store {
        id: UID,
        /// The user who owns this vault
        owner: address,
        /// The authorized agent address (can be a backend or TEE)
        authorized_agent: address,
        /// Deposited balance
        balance: Balance<T>,
        /// The user's PredictManager object ID (for routing trades)
        predict_manager_id: ID,
        /// Risk policy governing agent behavior
        policy: TradePolicy,
        /// Total number of trades executed
        trade_count: u64,
        /// Whether the vault is active (agent can trade)
        is_active: bool,
    }

    // ─── Constructor ────────────────────────────────────────

    /// Create a new agent vault. The caller becomes the owner.
    public entry fun create_vault<T>(
        agent_address: address,
        predict_manager_id: ID,
        ctx: &mut TxContext,
    ) {
        let owner = sui::tx_context::sender(ctx);
        let vault = AgentVault<T> {
            id: object::new(ctx),
            owner,
            authorized_agent: agent_address,
            balance: balance::zero<T>(),
            predict_manager_id,
            policy: trade_policy::default(),
            trade_count: 0,
            is_active: true,
        };

        let vault_id = object::id(&vault);
        events::emit_vault_created(vault_id, owner, agent_address);

        transfer::share_object(vault);
    }

    // ─── Deposit / Withdraw ─────────────────────────────────

    /// Deposit coins into the vault. Anyone can deposit (typically the owner).
    public entry fun deposit<T>(
        vault: &mut AgentVault<T>,
        coin: Coin<T>,
    ) {
        let amount = coin::value(&coin);
        let vault_id = object::id(vault);
        balance::join(&mut vault.balance, coin::into_balance(coin));
        events::emit_vault_deposit(vault_id, amount);
    }

    /// Withdraw coins from the vault. Owner only.
    public entry fun withdraw<T>(
        vault: &mut AgentVault<T>,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        let sender = sui::tx_context::sender(ctx);
        assert!(sender == vault.owner, E_NOT_OWNER);
        assert!(balance::value(&vault.balance) >= amount, E_INSUFFICIENT_BALANCE);

        let vault_id = object::id(vault);
        let withdrawn = coin::from_balance(balance::split(&mut vault.balance, amount), ctx);
        transfer::public_transfer(withdrawn, vault.owner);
        events::emit_vault_withdraw(vault_id, amount);
    }

    // ─── Agent Management ───────────────────────────────────

    /// Authorize a new agent address. Owner only.
    public entry fun set_agent<T>(
        vault: &mut AgentVault<T>,
        new_agent: address,
        ctx: &TxContext,
    ) {
        let sender = sui::tx_context::sender(ctx);
        assert!(sender == vault.owner, E_NOT_OWNER);

        vault.authorized_agent = new_agent;
        vault.is_active = true;
        events::emit_agent_authorized(object::id(vault), new_agent);
    }

    /// Revoke the agent's trading privileges immediately. Owner only.
    public entry fun revoke_agent<T>(
        vault: &mut AgentVault<T>,
        ctx: &TxContext,
    ) {
        let sender = sui::tx_context::sender(ctx);
        assert!(sender == vault.owner, E_NOT_OWNER);

        let old_agent = vault.authorized_agent;
        vault.is_active = false;
        events::emit_agent_revoked(object::id(vault), old_agent);
    }

    /// Update the trade policy. Owner only.
    public entry fun update_policy<T>(
        vault: &mut AgentVault<T>,
        max_trade_size: u64,
        max_daily_spend: u64,
        min_edge_bps: u64,
        allowed_directions: u8,
        ctx: &TxContext,
    ) {
        let sender = sui::tx_context::sender(ctx);
        assert!(sender == vault.owner, E_NOT_OWNER);

        trade_policy::update(
            &mut vault.policy,
            max_trade_size,
            max_daily_spend,
            min_edge_bps,
            allowed_directions,
        );
    }

    // ─── Agent Execution (called by executor module) ────────

    /// Verify that the caller is the authorized agent and vault is active.
    /// Returns a reference to the vault's policy for validation.
    public fun assert_authorized<T>(vault: &AgentVault<T>, ctx: &TxContext) {
        let sender = sui::tx_context::sender(ctx);
        assert!(sender == vault.authorized_agent || sender == vault.owner, E_NOT_AUTHORIZED);
        assert!(vault.is_active, E_NOT_AUTHORIZED);
    }

    /// Withdraw balance for trade execution. Called by executor module.
    /// Caller must have already verified authorization.
    public fun withdraw_for_trade<T>(
        vault: &mut AgentVault<T>,
        amount: u64,
        ctx: &mut TxContext,
    ): Coin<T> {
        assert!(balance::value(&vault.balance) >= amount, E_INSUFFICIENT_BALANCE);
        vault.trade_count = vault.trade_count + 1;
        coin::from_balance(balance::split(&mut vault.balance, amount), ctx)
    }

    /// Get mutable reference to the policy for check_and_apply.
    public fun policy_mut<T>(vault: &mut AgentVault<T>): &mut TradePolicy {
        &mut vault.policy
    }

    /// Get read-only reference to the policy.
    public fun policy<T>(vault: &AgentVault<T>): &TradePolicy {
        &vault.policy
    }

    // ─── Readers ────────────────────────────────────────────

    public fun owner<T>(vault: &AgentVault<T>): address { vault.owner }
    public fun authorized_agent<T>(vault: &AgentVault<T>): address { vault.authorized_agent }
    public fun balance_value<T>(vault: &AgentVault<T>): u64 { balance::value(&vault.balance) }
    public fun predict_manager_id<T>(vault: &AgentVault<T>): ID { vault.predict_manager_id }
    public fun trade_count<T>(vault: &AgentVault<T>): u64 { vault.trade_count }
    public fun is_active<T>(vault: &AgentVault<T>): bool { vault.is_active }
    public fun vault_id<T>(vault: &AgentVault<T>): ID { object::id(vault) }
}
