# Prediction Market Backend: Pool Creation, YES/NO Flow & Resolution

> Last updated: 2026-05-29  
> Status: Implementation-ready design document

**Related docs:**
- [resolution_sources.md](./resolution_sources.md) — Where each category gets its outcome data (weather → Wunderground, crypto → Pyth, etc.)
- [architecture.md](./architecture.md) — Full system architecture
- [onchain_implementation.md](./onchain_implementation.md) — Agent vault & executor design

---

## 1. System Overview — Two On-Chain Systems

Insuight runs two parallel prediction market systems:

| System | Contracts | Collateral | Purpose |
|--------|-----------|------------|---------|
| **Custom Market** | `contracts/predict/` | SUI | Simple binary YES/NO pools — own orderbook |
| **DeepBook Predict** | MystenLabs (deployed) | DUSDC | Live oracle-backed prediction markets |

---

## 2. Custom Prediction Market — Contract Architecture

### Module Dependency Graph
```
predict::market
  ├── predict::yes   (YES Coin<YES> — 9 decimals)
  └── predict::no    (NO Coin<NO>  — 9 decimals)
```

### Market Object (Shared On-Chain State)
```move
public struct Market has key {
    id: UID,
    description: String,       // The prediction question
    vault: Balance<SUI>,       // Locked collateral from all mints
    yes_treasury: TreasuryCap<YES>,  // Minting authority for YES tokens
    no_treasury: TreasuryCap<NO>,    // Minting authority for NO tokens
    resolved: bool,            // True after admin resolves
    winner: u8,                // 0=unresolved, 1=YES wins, 2=NO wins
}

public struct AdminCap has key {
    id: UID,
    market_id: ID,             // Bound to exactly one Market
}
```

### Error Codes
| Code | Constant | When Triggered |
|------|----------|---------------|
| 0 | `EMarketAlreadyResolved` | Mint or resolve called after resolution |
| 1 | `EInvalidAdminCap` | AdminCap doesn't match the Market ID |
| 2 | `EInvalidWinnerSide` | resolve() called with winner ≠ 1 or 2 |
| 3 | `EMarketNotResolved` | Claiming before resolution |
| 4 | `EWrongWinningToken` | Claiming NO tokens when YES won, or vice versa |

---

## 3. Full Lifecycle Flow

### 3.1 Pool Creation

**Who:** Admin/deployer (requires YES + NO TreasuryCaps from `init()`)

```move
public fun create_market(
    description: String,
    yes_treasury: TreasuryCap<YES>,
    no_treasury: TreasuryCap<NO>,
    ctx: &mut TxContext
)
```

**What happens on-chain:**
```
1. Create Market shared object
   - vault = empty Balance<SUI>
   - resolved = false
   - winner = 0
2. Create AdminCap object bound to this Market's ID
3. transfer::share_object(market)      → globally accessible
4. transfer::transfer(admin_cap, ctx.sender())  → only deployer gets this
```

**PTB (frontend):**
```typescript
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::market::create_market`,
  arguments: [
    tx.pure.string(description),
    tx.object(yesTreasuryId),
    tx.object(noTreasuryId),
  ],
});
```

> ⚠️ **One market per deployment** — `TreasuryCap` is consumed (moved) into the Market object. Each `sui client publish` can create exactly one market.

---

### 3.2 Minting YES + NO Shares

**Who:** Any user with SUI

```move
public fun mint(
    market: &mut Market,
    payment: Coin<SUI>,
    ctx: &mut TxContext
): (Coin<YES>, Coin<NO>)
```

**What happens on-chain:**
```
1. Assert market.resolved == false
2. amount = payment.value()
3. balance::join(&mut market.vault, coin::into_balance(payment))
   → SUI is LOCKED — user can't get it back except by winning
4. yes_coin = coin::mint(&mut market.yes_treasury, amount, ctx)
5. no_coin  = coin::mint(&mut market.no_treasury, amount, ctx)
6. Return (yes_coin, no_coin)
   → 1 SUI deposited = 1 YES token + 1 NO token (always fully collateralised)
```

**Invariant:** `total_YES_minted == total_NO_minted == total_SUI_in_vault`

**PTB (frontend):**
```typescript
const tx = new Transaction();
const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(suiAmount)]);
const [yesCoin, noCoin] = tx.moveCall({
  target: `${PACKAGE_ID}::market::mint`,
  arguments: [tx.object(marketId), payment],
});
// Keep YES, sell NO (or vice versa based on position)
tx.transferObjects([yesCoin, noCoin], tx.pure.address(userAddress));
```

---

### 3.3 Price Discovery via DeepBook V3

After minting, users sell the unwanted side on DeepBook V3 orderbook pools:

```
Bullish on YES?  →  Keep YES tokens, sell NO on NO/SUI pool
Bearish (NO)?   →  Keep NO tokens, sell YES on YES/SUI pool
```

**How market price forms:**
```
YES price = 1 - NO_market_price  (in SUI terms)

If market thinks 60% chance of YES:
  YES trades at ~0.60 SUI
  NO  trades at ~0.40 SUI
```

**PTB (sell NO tokens on DeepBook):**
```typescript
const tx = new Transaction();
tx.moveCall({
  target: `${DEEPBOOK_PACKAGE}::pool::place_limit_order`,
  arguments: [
    tx.object(noSuiPoolId),
    tx.pure.u64(price),
    tx.pure.u64(quantity),
    tx.pure.bool(false),          // is_bid = false (selling)
    tx.object(noCoinObjectId),
  ],
  typeArguments: [`${PACKAGE_ID}::no::NO`, '0x2::sui::SUI'],
});
```

> ⚠️ NO/SUI and YES/SUI DeepBook V3 pools need to be created before trading is possible.

---

### 3.4 Resolution (Admin Only)

**Who:** Holder of `AdminCap` for this market

```move
public fun resolve(
    market: &mut Market,
    cap: &AdminCap,
    winner: u8     // 1 = YES wins, 2 = NO wins
)
```

**What happens on-chain:**
```
1. Assert object::id(market) == cap.market_id  → correct cap for this market
2. Assert !market.resolved                      → can't re-resolve
3. Assert winner == 1 || winner == 2            → valid winner
4. market.resolved = true
5. market.winner  = winner
```

**PTB (frontend — admin only):**
```typescript
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::market::resolve`,
  arguments: [
    tx.object(marketId),
    tx.object(adminCapId),
    tx.pure.u8(winner),   // 1 for YES, 2 for NO
  ],
});
```

---

### 3.5 Claiming Winnings

**Who:** Holders of winning tokens (YES if winner=1, NO if winner=2)

**Claim YES winnings:**
```move
public fun claim_yes(
    market: &mut Market,
    yes_token: Coin<YES>,
    ctx: &mut TxContext
): Coin<SUI>
```

```
1. Assert market.resolved == true
2. Assert market.winner == 1  (YES won)
3. amount = yes_token.value()
4. coin::burn(&mut market.yes_treasury, yes_token)  → token destroyed
5. Return balance::split(&mut market.vault, amount) → withdraw SUI
```

**PTB (frontend):**
```typescript
const tx = new Transaction();
const payout = tx.moveCall({
  target: `${PACKAGE_ID}::market::claim_yes`,  // or claim_no
  arguments: [tx.object(marketId), tx.object(yesTokenObjectId)],
});
tx.transferObjects([payout], tx.pure.address(userAddress));
```

**Payout math:**
```
If you held 100 YES tokens and YES won:
  → Receive 100 SUI from the vault (your full 1:1 redemption)

If you bought 100 YES for 0.60 SUI each (sold NO at 0.40 each):
  → Net profit: 100 SUI received - 60 SUI cost = 40 SUI profit (66% return)
```

---

## 4. Insuight Agent System — DeepBook Predict Integration

The agent system uses **DeepBook Predict** (MystenLabs' infrastructure, already deployed on testnet).

### 4.1 Agent Vault

```move
AgentVault<T> {
    owner: address,              // User — full control
    authorized_agent: address,   // Backend/TEE that can execute trades
    balance: Balance<T>,         // DUSDC held in vault
    predict_manager_id: ID,      // Links to DeepBook Predict PredictManager
    policy: TradePolicy,         // On-chain risk guardrails
    trade_count: u64,
    is_active: bool,
}
```

**User lifecycle:**
```
create_vault() → deposit() → [agent trades] → withdraw() / revoke_agent()
```

### 4.2 TradePolicy — On-Chain Risk Guardrails

```move
TradePolicy {
    max_trade_size: u64,    // Default: 100 DUSDC per trade
    max_daily_spend: u64,   // Default: 500 DUSDC per day
    spent_today: u64,       // Rolling counter (resets per Sui epoch)
    last_reset_epoch: u64,
    min_edge_bps: u64,      // Default: 500 (5% minimum edge)
    allowed_directions: u8, // 1=UP only, 2=DOWN only, 3=BOTH
}
```

All limits enforced **on-chain** — the agent cannot bypass them.

### 4.3 Signal Engine — On-Chain AI Algorithm

The deterministic trading algorithm with no off-chain dependencies:

```
Oracle Data (spot, forward, strike, σ)
        │
        ├── Momentum Signal (60% weight)
        │     premium = |forward - spot| / spot
        │     conviction = 5000 + premium_bps × 10
        │     dampened by: higher σ → less conviction
        │
        └── Reversion Signal (40% weight)
              deviation = |reference - strike| / strike
              only activates if deviation > 3%
              direction = opposite of deviation
              conviction = 5000 + deviation_bps × 5
                        │
                        ▼
            Ensemble Combiner
              Both agree  → weighted avg (60/40)
              Disagree    → stronger signal wins, penalised toward 50%
                        │
                        ▼
            Edge = |conviction - oracle_implied_probability|
            Actionable = edge ≥ min_edge_bps (user-set, default 5%)
```

**Conviction range:** 5% to 95% (clamped — never fully certain)

### 4.4 Executor Trade Flow

When the agent calls `execute_agent_trade<T>()`:

```
Step 1: assert_authorized()
        → sender == vault.authorized_agent OR vault.owner
        → vault.is_active == true

Step 2: signal_engine::compute_final_signal()
        → Using oracle's spot, forward, SVI sigma, strike, implied probability

Step 3: Assert signal.is_actionable
        → Edge must meet vault's min_edge_bps threshold

Step 4: trade_policy::check_and_apply()
        → quantity ≤ max_trade_size          (abort: code 1)
        → spent_today + qty ≤ max_daily_spend (abort: code 2)
        → edge ≥ min_edge_bps                 (abort: code 3)
        → direction ∈ allowed_directions      (abort: code 4)

Step 5: agent_vault::withdraw_for_trade()
        → Split DUSDC from vault balance
        → Increment trade_count

Step 6: Transfer DUSDC to owner's address
        → For PTB composition with predict::deposit + predict::mint_position

Step 7: Emit events
        → TradeSignalComputed  (reasoning audit trail)
        → AgentTradeExecuted   (trade record)
```

> **Important:** The actual `predict::mint_position` call must be composed in the **same PTB** after `execute_agent_trade` withdraws funds. The executor deliberately separates fund withdrawal from position minting for composability.

---

## 5. Event Audit Trail

Every agent action emits on-chain events for full transparency:

| Event | When | Key Fields |
|-------|------|-----------|
| `VaultCreated` | `create_vault()` | vault_id, owner, agent |
| `VaultDeposit` | `deposit()` | vault_id, amount |
| `VaultWithdraw` | `withdraw()` | vault_id, amount |
| `AgentAuthorized` | `set_agent()` | vault_id, new_agent |
| `AgentRevoked` | `revoke_agent()` | vault_id, old_agent |
| `TradeSignalComputed` | pre-trade | oracle_id, direction, momentum_bps, reversion_bps, conviction_bps, edge_bps, is_actionable |
| `AgentTradeExecuted` | post-trade | vault_id, oracle_id, direction, strike, quantity, conviction_bps, timestamp |
| `PolicyViolation` | on rejection | vault_id, reason (1-4) |

---

## 6. Frontend Transaction Layer (Planned)

### New Service: `src/services/marketTransactions.ts`
```typescript
buildCreateMarketTx(description, yesTreasuryId, noTreasuryId) → Transaction
buildMintSharesTx(marketId, suiAmount)                         → Transaction
buildResolveTx(marketId, adminCapId, winner: 1 | 2)            → Transaction
buildClaimYesTx(marketId, yesTokenObjectId)                    → Transaction
buildClaimNoTx(marketId, noTokenObjectId)                      → Transaction
```

### New Hooks: `src/hooks/useMarketActions.ts`
```typescript
useCreateMarket()   → { create, isPending, error }
useMintShares()     → { mint, isPending, error, txDigest }
useResolveMarket()  → { resolve, isPending, error }   // admin only
useClaimWinnings()  → { claim, isPending, error, txDigest }
```

### New Components
- `TradeModal.tsx` — Buy YES or NO, shows SUI amount → tokens received
- `CreateMarketModal.tsx` — Admin UI to deploy new prediction pools

---

## 7. Deployment Checklist

```bash
# 1. Publish the predict package (YES/NO tokens + market)
sui client publish contracts/predict/ --gas-budget 100000000

# 2. Note the published package ID and object IDs from output:
#    - Package ID       → replace PACKAGE_ID in constants
#    - YES TreasuryCap  → needed for create_market tx
#    - NO TreasuryCap   → needed for create_market tx

# 3. Create the market on-chain
#    (call create_market with description + both treasury IDs)

# 4. (Optional) Create DeepBook V3 pools for YES/SUI and NO/SUI trading

# 5. Publish the insuight package (agent vault + executor)
sui client publish contracts/insuight/ --gas-budget 100000000
```

---

## 8. Security Properties

| Property | How Enforced |
|----------|-------------|
| **Fully collateralised** | `total_vault_SUI == total_YES_minted == total_NO_minted` invariant in `mint()` |
| **No double-resolution** | `EMarketAlreadyResolved` check in `resolve()` |
| **Only valid winners** | `assert!(winner == 1 \|\| winner == 2)` |
| **Agent can't overspend** | `TradePolicy` enforced on-chain in `executor.move` |
| **User always in control** | `withdraw()` and `revoke_agent()` are owner-only, always callable |
| **Agent can't fake signals** | `signal_engine` computation is on-chain and deterministic |
| **No rug-pull** | Vault SUI can only leave via `claim_yes` or `claim_no` — not by admin |
