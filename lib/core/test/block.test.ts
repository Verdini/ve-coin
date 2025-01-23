import { describe, it } from "node:test";
import { buildWallet } from "../Wallet";
import { signTransaction, Transaction } from "../Transaction";
import assert from "node:assert";
import { Block, isValidBlock, mineBlock } from "../Block";

describe("Core Block tests", () => {
  it("should create a valid block", (context) => {
    context.mock.timers.enable({ apis: ["Date"], now: 100 });

    const wallet1 = buildWallet();
    const wallet2 = buildWallet();
    const transactions = [
      {
        fromAddress: "",
        toAddress: wallet2.address,
        amount: 100,
        fee: 5,
        timestamp: new Date().getTime(),
        signature: "",
      },
      {
        fromAddress: wallet1.address,
        toAddress: wallet2.address,
        amount: 100,
        fee: 5,
        timestamp: new Date().getTime(),
        signature: "",
      },
    ] as Transaction[];
    signTransaction(transactions[1], wallet1.key);

    const block = {
      header: {
        timestamp: new Date().getTime(),
        previousHash: "",
        message: "Test block",
        nonce: 0,
      },
      transactions,
    } as Block;

    assert.equal(isValidBlock(block), true);
  });

  it("should mine a block", (context) => {
    context.mock.timers.enable({ apis: ["Date"], now: 100 });

    const minerWallet = buildWallet();
    const wallet1 = buildWallet();
    const wallet2 = buildWallet();

    const transactions = [
      {
        fromAddress: wallet1.address,
        toAddress: wallet2.address,
        amount: 100,
        fee: 5,
        timestamp: new Date().getTime(),
        signature: "",
      },
      {
        fromAddress: wallet1.address,
        toAddress: wallet2.address,
        amount: 100,
        fee: 5,
        timestamp: new Date().getTime(),
        signature: "",
      },
    ] as Transaction[];
    signTransaction(transactions[0], wallet1.key);
    signTransaction(transactions[1], wallet1.key);

    console.debug("Starting mining");
    const block = mineBlock({
      previousHash: "",
      transactions,
      message: "Test block",
      difficulty: 0,
      reward: 100,
      minerAddress: minerWallet.address,
    });
    console.debug("Finished mining");

    assert.deepStrictEqual(block.transactions[0], {
      fromAddress: "",
      toAddress: minerWallet.address,
      amount: 110,
      fee: 0,
      timestamp: 100,
      signature: "",
    });
    assert.equal(isValidBlock(block), true);
  });
});
