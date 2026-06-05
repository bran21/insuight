# How the Prediction Market Works in Sui

This document explains the architectural design of the custom Prediction Market smart contract deployed in this project and why it operates the way it does on the Sui blockchain.

## One Market Per Package Deployment

Because of how the `predict` contract is currently written, **you can only create exactly ONE market per deployed package.**

Here is the technical breakdown of why this happens:

1. **One-Time Witnesses (OTW) for Coins:**
   In Sui Move, generating a new native Coin (like `YES` and `NO`) requires a One-Time Witness (OTW). This means those coins are hardcoded to the package when you deploy it. Upon package initialization, exactly one `TreasuryCap<YES>` and one `TreasuryCap<NO>` are generated and transferred to the deployer.

2. **Consuming the TreasuryCap:**
   When you call the `create_market` function, the smart contract takes those `TreasuryCap` objects **by value** and locks them permanently inside the new `Market` shared object. This is done so that the market pool has the exclusive authority to mint and burn shares based on user deposits.

3. **Single Use Capability:**
   Because the `TreasuryCap` is consumed by the `Market` object, your deployer wallet no longer holds it. As a result, you cannot call `create_market` a second time. The capabilities are locked to that single specific market pool.

## Creating Multiple Markets

If you want to create another market with its own distinct `YES` and `NO` coins using this specific contract architecture, you must **deploy the contract package again** to generate a fresh set of `YES` and `NO` TreasuryCaps for the new market.

> [!NOTE]
> Advanced dynamic prediction markets (like the official DeepBook Predict) avoid this limitation by minting generic NFTs/Positions with dynamic fields instead of native Sui Coins. This allows infinite markets to be created dynamically from a single contract deployment!
