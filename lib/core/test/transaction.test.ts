import { describe, it } from "node:test";
import { Wallet } from "../Wallet";
import { Transaction } from "../Transaction";
import assert from "node:assert";

describe("Core Transaction tests", () => {
  it("should create a valid transaction", () => {
    const from = new Wallet();
    const to = new Wallet();

    const transaction = new Transaction({
      fromAddress: from.Address,
      toAddress: to.Address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
    });
    transaction.Sign(from.Key);

    const isValid = transaction.IsValid();
    assert.equal(isValid, true);
  });

  it("should validate transaction correctly", () => {
    const from = new Wallet();
    const to = new Wallet();

    const transaction = new Transaction({
      fromAddress: from.Address,
      toAddress: to.Address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
    });
    transaction.Sign(to.Key);

    const isValid = transaction.IsValid();
    assert.equal(isValid, false);
  });
});
