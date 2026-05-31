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

public struct Market has key {
    id: UID,
    description: String,
    vault: Balance<SUI>,
    yes_treasury: TreasuryCap<YES>,
    no_treasury: TreasuryCap<NO>,
    resolved: bool,
    winner: u8, // 0 = unresolved, 1 = YES, 2 = NO
}

public struct AdminCap has key {
    id: UID,
    market_id: ID,
}

public fun create_market(
    description: String,
    yes_treasury: TreasuryCap<YES>,
    no_treasury: TreasuryCap<NO>,
    ctx: &mut TxContext
) {
    let market = Market {
        id: object::new(ctx),
        description,
        vault: balance::zero(),
        yes_treasury,
        no_treasury,
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
    
    // Lock the SUI collateral
    balance::join(&mut market.vault, coin::into_balance(payment));
    
    // Mint 1 YES and 1 NO token for each SUI locked
    let yes_coin = coin::mint(&mut market.yes_treasury, amount, ctx);
    let no_coin = coin::mint(&mut market.no_treasury, amount, ctx);
    
    (yes_coin, no_coin)
}

public fun resolve(market: &mut Market, cap: &AdminCap, winner: u8) {
    assert!(object::id(market) == cap.market_id, EInvalidAdminCap);
    assert!(!market.resolved, EMarketAlreadyResolved);
    assert!(winner == 1 || winner == 2, EInvalidWinnerSide);
    
    market.resolved = true;
    market.winner = winner;
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
