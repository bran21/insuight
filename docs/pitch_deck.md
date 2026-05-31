# Insuight — Pitch Deck

---

## 🔮 The Problem

Prediction markets are **information machines** — but today, they're stuck in a human-only loop:

1. **Users research manually** — slow, biased, incomplete
2. **No systematic pricing analysis** — gut feeling vs. math
3. **Execution friction** — multiple clicks, manual gas management
4. **Zero transparency** — why did someone place that trade?

Meanwhile, **AI agents are getting smarter** — but they have no safe way to participate in financial markets with cryptographic guarantees.

---

## 💡 The Solution: Insuight

**Insuight = AI Agent Intelligence × DeepBook Predict × Sui**

An autonomous AI agent that:
- 🔍 **Researches** events affecting active prediction markets
- 📊 **Analyzes** oracle pricing using probability models
- 🎯 **Detects** mispricings between AI estimates and market prices
- 📝 **Proposes** trades with full transparent reasoning
- ✍️ **Awaits** user signature — human stays in control

---

## 🏗️ Architecture

```
     ┌──────────────┐
     │  News / Data  │
     └──────┬───────┘
            ▼
     ┌──────────────┐
     │   AI Agent    │  ← Reasoning + Tool Calling
     │  (LLM-based)  │
     └──────┬───────┘
            ▼
     ┌──────────────┐
     │  Insuight UI  │  ← Inner Monologue + Trade Proposals
     └──────┬───────┘
            ▼
     ┌──────────────┐
     │ DeepBook     │  ← Binary Positions, Ranges, Vault
     │ Predict (Sui)│
     └──────────────┘
```

---

## 🔑 Key Innovation: The Inner Monologue

Every agent action is **transparent and auditable**:

```
[RESEARCH] Scanning oracles... Found BTC/USD expiry May 20
[ANALYZE]  Oracle fair price: 65% UP above $68,000
[AI MODEL] My estimate: 78% UP (based on ETF inflows + halving data)
[SIGNAL]   Mispricing detected: +13% edge
[PROPOSE]  Mint UP position: strike=$68,000, qty=100 DUSDC
[WAITING]  Awaiting user signature...
```

---

## 🧱 Built on the Sui Stack

| Layer | Technology |
|-------|-----------|
| **Trading** | DeepBook Predict (Testnet) |
| **Execution** | Sui PTBs (atomic deposit + mint) |
| **Wallet** | Sui dApp Kit |
| **Storage** | Walrus (agent research logs) |
| **Identity** | zkLogin (frictionless onboarding) |

---

## 📈 Market Opportunity

- Prediction markets: **$50B+** total volume in 2025
- AI agents in DeFi: **fastest-growing** category in crypto
- DeepBook Predict: **first mover** on Sui — no competition yet
- Agentic Web: **Mysten Labs' flagship** thesis for 2026

---

## 🏆 Why Insuight Wins

| vs. Polymarket | vs. Manual Trading | vs. Generic AI Bots |
|:-:|:-:|:-:|
| On-chain, non-custodial | AI-automated research | Transparent reasoning |
| Oracle-driven pricing | Systematic analysis | Sui-native (PTBs) |
| Composable DeFi stack | One-click execution | User stays in control |

---

## 👥 Team & Ask

**Building at the intersection of AI and on-chain finance.**

- ✅ Existing DeepBook V3 integration experience (Sagacy AI)
- ✅ Full-stack React + Sui dApp Kit proficiency
- ✅ Live testnet integration ready

**Ask**: Hackathon track submission for **DeepBook Predict** + **Agentic Web**

---

**Insuight: See the future. Trade the signal.** 🔮
