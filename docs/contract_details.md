# Insuight Custom Market Contract Details

This document tracks the deployed object IDs and package details for the Custom Prediction Market (with AMM functionality) on the Sui Testnet.

## Core Contract

* **Network**: Sui Testnet
* **Package ID**: `0x16c6416471bd1dd2178a666e6f72f04f7f6c7c9330f88a01c151b1dc26c68d01`
* **Deployer Address**: `0x2e1666ae83f393acc2db2ff53255f09a1ebe30a1d8036a9da5d3b5abdb7cbbb0`

## Minting Authorities (TreasuryCaps)

These TreasuryCaps are required to initialize new custom prediction markets via the `create_market` function.

* **YES TreasuryCap Object ID**: `0xe3518f4f0f408fbd104f29e13d86e0e326b3208decc8bf97408d71f5fead3c7f`
* **NO TreasuryCap Object ID**: `0x5bdc185a0751b562c4ce7ac03d58e20bec1683a25b9ca359201de2c7043c5d0a`

> [!TIP]
> Keep these TreasuryCap IDs handy! Whenever you want to create a new market through the UI, you will need to paste these exact IDs into the **Create Market Modal**.

---

## AI Signal Engine & Trading Policies (Insuight)

This contract contains the core AI signaling logic, volatility dampening, and the execution engine for the DeepBook integration.

* **Network**: Sui Testnet
* **Package ID**: `0xa40e0dc106887a4e18aeb5c0e7195b6859d9f8f228acc3552d316159a96b4b20`
