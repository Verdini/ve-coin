import { describe, it } from "node:test";
import { buildWallet } from "../Wallet.js";
import assert from "node:assert";

describe("Core Wallet tests", () => {
  it("should generate a new address", () => {
    const wallet = buildWallet();

    assert.notEqual(wallet.address, null);
    assert.equal(wallet.address.length, 130);

    assert.notEqual(wallet.key, null);
    assert.equal(wallet.key.length, 64);
  });
});
