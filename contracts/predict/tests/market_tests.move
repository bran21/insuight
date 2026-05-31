#[test_only]
module predict::market_tests;

use sui::test_scenario::{Self, Scenario};
use sui::coin::{Self, Coin, TreasuryCap};
use sui::sui::SUI;
use std::string;
use predict::market::{Self, Market, AdminCap};
use predict::yes::{Self, YES};
use predict::no::{Self, NO};

#[test]
fun test_prediction_market_flow() {
    let mut scenario_val = test_scenario::begin(@0xAD014);
    let scenario = &mut scenario_val;
    let admin = @0xAD014;
    let user1 = @0xB0B;

    // 1. Initialize YES and NO tokens
    test_scenario::next_tx(scenario, admin);
    {
        yes::test_init(test_scenario::ctx(scenario));
        no::test_init(test_scenario::ctx(scenario));
    };

    // 2. Create Market
    test_scenario::next_tx(scenario, admin);
    {
        let yes_treasury = test_scenario::take_from_sender<TreasuryCap<YES>>(scenario);
        let no_treasury = test_scenario::take_from_sender<TreasuryCap<NO>>(scenario);
        market::create_market(
            string::utf8(b"Will Bitcoin hit 100k?"),
            yes_treasury,
            no_treasury,
            test_scenario::ctx(scenario)
        );
    };

    // 3. User1 mints shares using 100 SUI
    test_scenario::next_tx(scenario, user1);
    {
        let mut market_obj = test_scenario::take_shared<Market>(scenario);
        let payment = coin::mint_for_testing<SUI>(100, test_scenario::ctx(scenario));
        
        let (yes_tokens, no_tokens) = market::mint(&mut market_obj, payment, test_scenario::ctx(scenario));
        
        // Assert they received 100 YES and 100 NO
        assert!(coin::value(&yes_tokens) == 100, 0);
        assert!(coin::value(&no_tokens) == 100, 1);

        // Keep them for later
        transfer::public_transfer(yes_tokens, user1);
        transfer::public_transfer(no_tokens, user1);

        test_scenario::return_shared(market_obj);
    };

    // 4. Admin resolves market to YES (winner = 1)
    test_scenario::next_tx(scenario, admin);
    {
        let mut market_obj = test_scenario::take_shared<Market>(scenario);
        let admin_cap = test_scenario::take_from_sender<AdminCap>(scenario);
        
        market::resolve(&mut market_obj, &admin_cap, 1);

        test_scenario::return_shared(market_obj);
        test_scenario::return_to_sender(scenario, admin_cap);
    };

    // 5. User1 claims winnings using YES tokens
    test_scenario::next_tx(scenario, user1);
    {
        let mut market_obj = test_scenario::take_shared<Market>(scenario);
        let yes_tokens = test_scenario::take_from_sender<Coin<YES>>(scenario);
        
        let payout = market::claim_yes(&mut market_obj, yes_tokens, test_scenario::ctx(scenario));
        
        // User should get 100 SUI back
        assert!(coin::value(&payout) == 100, 2);

        transfer::public_transfer(payout, user1);
        test_scenario::return_shared(market_obj);
    };

    test_scenario::end(scenario_val);
}
