import { describe, it } from "node:test";
import { buildWallet } from "../Wallet.ts";
import {
  isValidTransaction,
  signTransaction,
  Transaction,
} from "../Transaction.ts";
import assert from "node:assert";

describe("Core Transaction tests", () => {
  it("should create a valid transaction", () => {
    const from = buildWallet();
    const to = buildWallet();

    const transaction = {
      fromAddress: from.address,
      toAddress: to.address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
    } as Transaction;
    signTransaction(transaction, from.key);

    assert.equal(isValidTransaction(transaction), true);
  });

  it("should generate a invalid transaction", () => {
    const from = buildWallet();
    const to = buildWallet();

    const transaction = {
      fromAddress: from.address,
      toAddress: to.address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
    } as Transaction;
    signTransaction(transaction, to.key);

    assert.equal(isValidTransaction(transaction), false);
  });
});
