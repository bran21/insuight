module predict::yes;

use sui::coin;

public struct YES has drop {}

fun init(witness: YES, ctx: &mut TxContext) {
    let (treasury, metadata) = coin::create_currency(witness, 9, b"YES", b"Yes Share", b"Prediction Market YES Share", option::none(), ctx);
    transfer::public_transfer(treasury, ctx.sender());
    transfer::public_transfer(metadata, ctx.sender());
}

#[test_only]
public fun test_init(ctx: &mut TxContext) {
    init(YES {}, ctx);
}
