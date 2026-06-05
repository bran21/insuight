module predict::market;

use sui::coin::{Self, Coin, TreasuryCap};
use sui::balance::{Self, Balance};
use sui::sui::SUI;
use std::string::String;
use predict::yes::YES;
use predict::no::NO;

/// Error constants
const EMarketAlreadyResolved: u64 = 0;
const EInvalidAdminCap: u64 = 1;
const EInvalidWinnerSide: u64 = 2;
const EMarketNotResolved: u64 = 3;
const EWrongWinningToken: u64 = 4;
const EZeroAmount: u64 = 5;

public struct Market has key {
    id: UID,
    description: String,
    vault: Balance<SUI>,
    yes_treasury: TreasuryCap<YES>,
    no_treasury: TreasuryCap<NO>,
    pool_yes: Balance<YES>,
    pool_no: Balance<NO>,
    resolved: bool,
    winner: u8, // 0 = unresolved, 1 = YES, 2 = NO
}

public struct AdminCap has key, store {
    id: UID,
    market_id: ID,
}

public fun create_market(
    description: String,
    yes_treasury: TreasuryCap<YES>,
    no_treasury: TreasuryCap<NO>,
    payment: Coin<SUI>,
    ctx: &mut TxContext
) {
    let amount = payment.value();
    assert!(amount > 0, EZeroAmount);

    let mut vault = balance::zero();
    balance::join(&mut vault, coin::into_balance(payment));

    let mut yes_t = yes_treasury;
    let mut no_t = no_treasury;

    let pool_yes = coin::into_balance(coin::mint(&mut yes_t, amount, ctx));
    let pool_no = coin::into_balance(coin::mint(&mut no_t, amount, ctx));

    let market = Market {
        id: object::new(ctx),
        description,
        vault,
        yes_treasury: yes_t,
        no_treasury: no_t,
        pool_yes,
        pool_no,
        resolved: false,
        winner: 0,
    };
    let admin_cap = AdminCap {
        id: object::new(ctx),
        market_id: object::id(&market),
    };
    transfer::share_object(market);
    transfer::transfer(admin_cap, ctx.sender());
}

public fun mint(market: &mut Market, payment: Coin<SUI>, ctx: &mut TxContext): (Coin<YES>, Coin<NO>) {
    assert!(!market.resolved, EMarketAlreadyResolved);
    let amount = payment.value();
    assert!(amount > 0, EZeroAmount);
    
    // Lock the SUI collateral
    balance::join(&mut market.vault, coin::into_balance(payment));
    
    // Mint 1 YES and 1 NO token for each SUI locked
    let yes_coin = coin::mint(&mut market.yes_treasury, amount, ctx);
    let no_coin = coin::mint(&mut market.no_treasury, amount, ctx);
    
    (yes_coin, no_coin)
}

public fun buy_yes(market: &mut Market, payment: Coin<SUI>, ctx: &mut TxContext): Coin<YES> {
    assert!(!market.resolved, EMarketAlreadyResolved);
    let amount = payment.value();
    assert!(amount > 0, EZeroAmount);

    // Lock the SUI collateral
    balance::join(&mut market.vault, coin::into_balance(payment));

    // Mint equal YES and NO
    let yes_minted = coin::mint(&mut market.yes_treasury, amount, ctx);
    let no_minted = coin::mint(&mut market.no_treasury, amount, ctx);

    let pool_yes_val = balance::value(&market.pool_yes) as u128;
    let pool_no_val = balance::value(&market.pool_no) as u128;

    // amount_out = (amount_in * reserve_out) / (reserve_in + amount_in)
    let yes_out = (((amount as u128) * pool_yes_val) / (pool_no_val + (amount as u128))) as u64;

    balance::join(&mut market.pool_no, coin::into_balance(no_minted));
    let mut yes_coin_from_pool = coin::from_balance(balance::split(&mut market.pool_yes, yes_out), ctx);

    coin::join(&mut yes_coin_from_pool, yes_minted);
    yes_coin_from_pool
}

public fun buy_no(market: &mut Market, payment: Coin<SUI>, ctx: &mut TxContext): Coin<NO> {
    assert!(!market.resolved, EMarketAlreadyResolved);
    let amount = payment.value();
    assert!(amount > 0, EZeroAmount);

    // Lock the SUI collateral
    balance::join(&mut market.vault, coin::into_balance(payment));

    // Mint equal YES and NO
    let yes_minted = coin::mint(&mut market.yes_treasury, amount, ctx);
    let no_minted = coin::mint(&mut market.no_treasury, amount, ctx);

    let pool_yes_val = balance::value(&market.pool_yes) as u128;
    let pool_no_val = balance::value(&market.pool_no) as u128;

    // amount_out = (amount_in * reserve_out) / (reserve_in + amount_in)
    let no_out = (((amount as u128) * pool_no_val) / (pool_yes_val + (amount as u128))) as u64;

    balance::join(&mut market.pool_yes, coin::into_balance(yes_minted));
    let mut no_coin_from_pool = coin::from_balance(balance::split(&mut market.pool_no, no_out), ctx);

    coin::join(&mut no_coin_from_pool, no_minted);
    no_coin_from_pool
}

public fun resolve(market: &mut Market, cap: &AdminCap, winner: u8) {
    assert!(object::id(market) == cap.market_id, EInvalidAdminCap);
    assert!(!market.resolved, EMarketAlreadyResolved);
    assert!(winner == 1 || winner == 2, EInvalidWinnerSide);
    
    market.resolved = true;
    market.winner = winner;
}

/// Allows an existing Admin to mint an additional AdminCap for the exact same market.
/// This enables delegating resolution authority to co-admins without giving up the original cap.
public fun delegate_admin(cap: &AdminCap, ctx: &mut TxContext): AdminCap {
    AdminCap {
        id: object::new(ctx),
        market_id: cap.market_id,
    }
}

public fun claim_yes(market: &mut Market, yes_token: Coin<YES>, ctx: &mut TxContext): Coin<SUI> {
    assert!(market.resolved, EMarketNotResolved);
    assert!(market.winner == 1, EWrongWinningToken);
    
    let amount = yes_token.value();
    coin::burn(&mut market.yes_treasury, yes_token);
    
    coin::from_balance(balance::split(&mut market.vault, amount), ctx)
}

public fun claim_no(market: &mut Market, no_token: Coin<NO>, ctx: &mut TxContext): Coin<SUI> {
    assert!(market.resolved, EMarketNotResolved);
    assert!(market.winner == 2, EWrongWinningToken);
    
    let amount = no_token.value();
    coin::burn(&mut market.no_treasury, no_token);
    
    coin::from_balance(balance::split(&mut market.vault, amount), ctx)
}
