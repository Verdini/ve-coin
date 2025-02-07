import { describe, it } from "node:test";
import { buildWallet } from "../Wallet";
import {
  isValidTransaction,
  signTransaction,
  Transaction,
} from "../Transaction";
import assert from "node:assert";

describe("Core Transaction tests", () => {
  const from = buildWallet();
  const to = buildWallet();

  it("should create a valid transaction", () => {
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

  it("should generate a invalid transaction", () => {
    const transaction = {
      fromAddress: from.address,
      toAddress: from.address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
    } as Transaction;
    signTransaction(transaction, from.key);

    assert.equal(isValidTransaction(transaction), false);
  });

  it("should generate a invalid transaction", () => {
    const transaction = {
      fromAddress: from.address,
      toAddress: to.address,
      amount: 0,
      fee: 0,
      timestamp: new Date().getTime(),
    } as Transaction;
    signTransaction(transaction, from.key);

    assert.equal(isValidTransaction(transaction), false);
  });
});
