import { describe, it } from "node:test";
import { Wallet } from "../Wallet";
import { Transaction } from "../Transaction";
import assert from "node:assert";
import { Block } from "../Block";

describe("Core Block tests", () => {
  function generateTransactions(from: Wallet, to: Wallet): Transaction[] {
    const coinbaseTx = new Transaction({
      fromAddress: "",
      toAddress: to.Address,
      amount: 100,
      fee: 0,
      timestamp: new Date().getTime(),
      message: "Coinbase transaction",
    });

    const tx = new Transaction({
      fromAddress: from.Address,
      toAddress: to.Address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
      message: "tx1",
    });
    tx.Sign(from.Key);
    return [coinbaseTx, tx];
  }

  it("should create a valid block", (context) => {
    context.mock.timers.enable({ apis: ["Date"], now: 100 });
    const transactions = generateTransactions(new Wallet(), new Wallet());

    const block1 = new Block(new Date().getTime(), transactions, "");

    assert.equal(block1.IsValid(), true);
  });
});
