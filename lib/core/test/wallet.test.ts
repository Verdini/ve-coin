import { describe, it } from "node:test";
import { Wallet } from "../Wallet.js";
import walletFixtures from "./fixtures/wallet.fixtures.json";
import assert from "node:assert";

describe("Core Wallet tests", () => {
  it("should generate a new address", () => {
    const wallet = new Wallet();

    assert.notEqual(wallet.Address, null);
    assert.equal(wallet.Address.length, 130);
  });

  it("should create a wallet from existing address and sign payload properly", () => {
    const address = walletFixtures.wallets[0].address;
    const privateKey = walletFixtures.wallets[0].privateKey;

    const wallet = new Wallet(address, privateKey);

    assert.equal(wallet.Address, address);
    assert.equal(wallet.Key, privateKey);
  });
});
