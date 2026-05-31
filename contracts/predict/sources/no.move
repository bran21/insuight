module predict::no;

use sui::coin;

public struct NO has drop {}

fun init(witness: NO, ctx: &mut TxContext) {
    let (treasury, metadata) = coin::create_currency(witness, 9, b"NO", b"No Share", b"Prediction Market NO Share", option::none(), ctx);
    transfer::public_transfer(treasury, ctx.sender());
    transfer::public_transfer(metadata, ctx.sender());
}

#[test_only]
public fun test_init(ctx: &mut TxContext) {
    init(NO {}, ctx);
}
