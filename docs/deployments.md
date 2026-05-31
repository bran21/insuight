# Insuight Testnet Deployments

> Last updated: 2026-05-31
> Network: Sui Testnet

This document contains the official deployed package IDs and objects for the Insuight prediction market and AI agent systems. These are required for hackathon submission details and frontend integration.

## 1. Custom Prediction Market System
*Handles custom binary YES/NO prediction pools and outcome tokens.*

| Component | Object ID |
| :--- | :--- |
| **Package ID** | `0xf8f92b0e934ac04faef02f273463638188767871068521979700e694d85761a8` |
| **YES Token TreasuryCap** | `0x7378c6b4e2a46e6c8f2afc2fcfca1e494da5e14d952936c9d94363fb713ca650` |
| **NO Token TreasuryCap** | `0x458bdd6f8cf9baea1c25f1aae5821b2749b3f4a4859378f8ca8a295e21b5bc81` |
| **YES Token Type** | `0xf8f92b0e934ac04faef02f273463638188767871068521979700e694d85761a8::yes::YES` |
| **NO Token Type** | `0xf8f92b0e934ac04faef02f273463638188767871068521979700e694d85761a8::no::NO` |

*Note: The TreasuryCaps are required by the admin to call `create_market` when initializing a new prediction pool on the frontend.*

---

## 2. Insuight Agent System
*Handles the on-chain AI signal engine, user non-custodial vaults, and trade executor for DeepBook Predict.*

| Component | Object ID |
| :--- | :--- |
| **Package ID** | `0xa40e0dc106887a4e18aeb5c0e7195b6859d9f8f228acc3552d316159a96b4b20` |
| **Modules Included** | `agent_vault`, `events`, `executor`, `signal_engine`, `trade_policy` |

---

## 3. External Dependencies (DeepBook Predict)
*MystenLabs' official prediction market infrastructure (already live on testnet).*

| Component | Object ID |
| :--- | :--- |
| **Predict Package** | `0xf5ea2b3749c65d6e56507cc35388719aadb28f9cab873696a2f8687f5c785138` |
| **Predict Object** | `0xc8736204d12f0a7277c86388a68bf8a194b0a14c5538ad13f22cbd8e2a38028a` |
| **Registry Object** | `0x43af14fed5480c20ff77e2263d5f794c35b9fab7e2212903127062f4fe2a6e64` |
| **DUSDC Token Type** | `0xe95040085976bfd54a1a07225cd46c8a2b4e8e2b6732f140a0fc49850ba73e1a::dusdc::DUSDC` |
