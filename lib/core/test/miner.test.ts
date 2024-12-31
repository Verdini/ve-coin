import { describe, it } from "node:test";
import { Wallet } from "../Wallet";
import { Miner } from "../Miner";
import assert from "node:assert";
import { Transaction } from "../Transaction";

describe("Core Miner tests", () => {
  function generateTransactions(from: Wallet, to: Wallet): Transaction[] {
    const tx = new Transaction({
      fromAddress: from.Address,
      toAddress: to.Address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
      message: "tx1",
    });
    tx.Sign(from.Key);

    const tx2 = new Transaction({
      fromAddress: from.Address,
      toAddress: to.Address,
      amount: 50,
      fee: 15,
      timestamp: new Date().getTime(),
      message: "tx1",
    });
    tx2.Sign(from.Key);

    return [tx, tx2];
  }

  it("should mine a block", () => {
    const wallet = new Wallet();
    const miner = new Miner(wallet);
    const transactions = generateTransactions(new Wallet(), new Wallet());
    console.debug("Starting mining");
    const block = miner.Mine("", transactions, 0, 100);
    console.debug("Finished mining");

    assert.deepStrictEqual(block.Transactions[0].ToJSON(), {
      fromAddress: "",
      toAddress: wallet.Address,
      amount: 125,
      fee: 0,
      timestamp: block.Timestamp,
      message: "Coinbase transaction",
      signature: "",
    });

    assert.equal(block.IsValid(), true);
  });
});
