# How the Prediction Market Works in Sui

This document explains the architectural design of the custom Prediction Market smart contract deployed in this project and why it operates the way it does on the Sui blockchain.

## One Market Per Package Deployment

Because of how Sui Move handles object ownership and native Coins:
1. Generating a new Coin (like `YES` and `NO`) requires a One-Time Witness (OTW).
2. OTWs are tied strictly to the package publishing transaction. They generate exactly one `TreasuryCap<YES>` and one `TreasuryCap<NO>` per deployment.
3. The `create_market` function in the custom contract completely *consumes* these `TreasuryCap` instances and embeds them into the newly created shared `Market` object.

Because the TreasuryCaps are locked inside the first created market, you cannot call `create_market` a second time with the same package. If you wish to create a distinct, isolated custom market pool, you must re-deploy the `predict` smart contract package entirely.

## Automated Market Maker (AMM) Integration

To emulate a fully functional prediction market (like Polymarket), the custom contract integrates a **Constant Product Market Maker (CPMM)**. 
- **Pools**: Each market maintains an internal `pool_yes` and `pool_no`.
- **Trading**: When a user buys YES, their SUI is locked into the vault, an equal number of YES and NO shares are minted, and their NO shares are instantly swapped into the AMM pool in exchange for *more* YES shares based on the `x * y = k` pricing curve.

## The Admin System & Delegation (Co-Resolvers)

When a market is created, an `AdminCap` object is minted and transferred directly to the creator's wallet. This `AdminCap` provides the sole authority to officially **Resolve** the market (declaring YES or NO as the winner).

### Delegation for Crowded Markets
To prevent the creator from becoming a bottleneck in highly active markets, the `AdminCap` structure has the `store` ability and the contract includes a `delegate_admin` function.

```move
public fun delegate_admin(cap: &AdminCap, ctx: &mut TxContext): AdminCap
```

This allows the original creator to mint *additional* `AdminCap` objects for the exact same market and transfer them to trusted co-admins. Any co-admin holding a valid `AdminCap` can then use the Admin Dashboard (`/admin`) to officially resolve the market on behalf of the protocol.

## Creating Multiple Markets

If you want to create another market with its own distinct `YES` and `NO` coins using this specific contract architecture, you must **deploy the contract package again** to generate a fresh set of `YES` and `NO` TreasuryCaps for the new market.

> [!NOTE]
> Advanced dynamic prediction markets (like the official DeepBook Predict) avoid this limitation by minting generic NFTs/Positions with dynamic fields instead of native Sui Coins. This allows infinite markets to be created dynamically from a single contract deployment!
