# Insuight: AI-Powered Prediction Intelligence on Sui
**Whitepaper v1.0 | Built on DeepBook Predict × Agentic Web**

---

## 1. Abstract

Insuight is an AI-powered prediction market interface built on Sui's **DeepBook Predict** protocol. It brings the **Agentic Web** vision to life by deploying autonomous AI agents that research real-world events, analyze oracle-driven pricing, identify mispricings, and execute binary prediction trades — all within a transparent, non-custodial framework.

Unlike traditional prediction market UIs that require manual research and trade execution, Insuight automates the entire intelligence pipeline: from event discovery to probability assessment to position management.

## 2. The Problem

### 2.1 The Human Bottleneck in Prediction Markets
Current prediction market interfaces (Polymarket, Kalshi) are built for humans:
- **Manual Research**: Users must independently gather information about events.
- **Subjective Pricing**: Users guess probabilities without systematic analysis.
- **Slow Execution**: The gap between "insight" and "trade" can be minutes or hours.
- **No Transparency**: The reasoning behind a trade is locked in the trader's head.

### 2.2 The Hostile Web (Agentic Web Problem)
As Mysten Labs articulates, the current web is *"stateless at the seams"* — hostile to autonomous agents that need to act:
- **No Trust Fabric**: Agents cannot transact with cryptographic certainty.
- **Fragmented Identity**: No universal, verifiable identity for agents.
- **No Guardrails**: No infrastructure to constrain agent behavior (spending limits, permissible actions).

## 3. The Insuight Solution

Insuight bridges these gaps by providing an **Agentic Intelligence Layer** on top of DeepBook Predict's institutional-grade infrastructure.

### 3.1 What DeepBook Predict Provides (The Foundation)
DeepBook Predict is a protocol — not a consumer product. It provides:
- **Binary Positions**: Directional bets keyed by `(oracle, expiry, strike, direction)`
- **Vertical Ranges**: Bounded range instruments keyed by `(oracle, expiry, lower, higher)`
- **OracleSVI**: Oracle-driven fair pricing with SVI volatility surface parameters
- **Shared Vault**: LPs supply DUSDC, receive PLP shares; vault takes opposite side of every trade
- **PredictManager**: Per-user account for balances, positions, and ranges

### 3.2 What Insuight Adds (The Intelligence)
Insuight adds the missing **reasoning and automation layer**:

| Capability | How It Works |
|-----------|-------------|
| **Event Research** | Agent scans news APIs to identify events relevant to active oracles |
| **Probability Analysis** | Agent compares its AI-derived probability against oracle fair price |
| **Mispricing Detection** | Agent flags when its confidence diverges significantly from market price |
| **Trade Proposal** | Agent constructs a PTB (deposit + mint_position) for user review |
| **Portfolio Oversight** | Agent monitors existing positions and suggests redeems at settlement |
| **Inner Monologue** | Every reasoning step is logged and displayed transparently |

### 3.3 What Agents CANNOT Do (Security by Design)
- ❌ **Create markets** — Oracle/market creation is admin-only
- ❌ **Settle oracles** — Settlement is triggered by authorized price pushers
- ❌ **Sign transactions** — All trades require explicit user wallet signature
- ❌ **Access private keys** — Agent operates in a read-propose-confirm loop

## 4. Technical Architecture

### 4.1 Three-Layer Stack
```
┌─────────────────────────────────────────┐
│           INSUIGHT FRONTEND             │
│  Dashboard · Agent Console · Portfolio  │
├─────────────────────────────────────────┤
│           AGENTIC LAYER                 │
│  LLM Reasoning · Tool Calling · PTBs   │
├─────────────────────────────────────────┤
│         DEEPBOOK PREDICT (SUI)          │
│  Predict · PredictManager · OracleSVI   │
│  Vault · PLP · DUSDC                    │
└─────────────────────────────────────────┘
```

### 4.2 Data Sources
1. **Predict Server** (`predict-server.testnet.mystenlabs.com`): Market state, oracle data, portfolio, PnL, vault summaries
2. **Sui Events**: Low-latency oracle price updates via `OraclePricesUpdated`, `OracleSettled`
3. **On-chain Objects**: Authoritative state reads for `Predict`, `PredictManager`, `OracleSVI` before wallet flows

### 4.3 Agent Execution Flow
```
1. Agent fetches active oracles from Predict Server
2. Agent identifies relevant real-world event
3. Agent calculates its own probability estimate
4. Agent compares estimate vs oracle fair price
5. If mispricing detected → Agent builds PTB:
   a. deposit(DUSDC) into PredictManager
   b. mint_position(oracle, expiry, strike, is_up, quantity)
6. Agent presents trade proposal with full reasoning
7. User reviews inner monologue and signs transaction
8. Position tracked in Portfolio view
```

## 5. Sui Stack Integration

| Component | Usage in Insuight |
|-----------|-------------------|
| **DeepBook Predict** | Core trading primitive — binary positions, ranges, vault |
| **Sui PTBs** | Atomic multi-step transactions (deposit + mint in one block) |
| **@mysten/sui** | TypeScript SDK for RPC and transaction building |
| **dApp Kit** | Wallet connection and transaction signing |
| **Walrus** | Store agent research logs as permanent, auditable blobs |

## 6. Competitive Advantage

| Feature | Polymarket | Kalshi | Insuight |
|---------|-----------|--------|----------|
| AI-Powered Research | ❌ | ❌ | ✅ |
| Transparent Reasoning | ❌ | ❌ | ✅ (Inner Monologue) |
| On-Chain Settlement | ❌ (Polygon) | ❌ (Centralized) | ✅ (Sui Native) |
| Oracle-Driven Pricing | ❌ | ❌ | ✅ (Block Scholes SVI) |
| Composable with DeFi | ❌ | ❌ | ✅ (DeepBook Stack) |
| Non-Custodial | Partial | ❌ | ✅ |

## 7. Roadmap

- **Phase 1 (Current)**: Testnet integration — Agent reads oracles, proposes trades, user signs
- **Phase 2**: Multi-agent strategies — Multiple specialized agents (news, technical, sentiment)
- **Phase 3**: Mainnet launch — Transition when DeepBook Predict goes live on Mainnet
- **Phase 4**: Agent-to-agent marketplace — Agents can subscribe to each other's signals

## 8. Conclusion

Insuight transforms DeepBook Predict from a raw financial primitive into an intelligent, agent-driven prediction interface. By making AI agents the researchers and analysts — while keeping humans as the final signers — Insuight delivers the Agentic Web vision: autonomous intelligence with cryptographic trust.

**Insuight: See the future. Trade the signal.** 🔮
