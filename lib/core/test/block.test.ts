import { describe, it } from "node:test";
import { signTransaction, Transaction } from "../Transaction";
import assert from "node:assert";
import {
  Block,
  getBlockHash,
  getMerkleRoot,
  isValidBlock,
  mineBlock,
} from "../Block";
import fixtures from "./fixtures/blockchain.fixtures.json" with { type: "json" };

describe("Core Block tests", () => {
  const wallets = fixtures.wallets;
  const walletMiner = { address: wallets[0].address, key: wallets[0].privateKey };
  const wallet1 = { address: wallets[1].address, key: wallets[1].privateKey };
  const wallet2 = { address: wallets[2].address, key: wallets[2].privateKey };

  it("should generate merkle root", () => {
    const transaction = {
      fromAddress: wallet1.address,
      toAddress: wallet2.address,
      amount: 100,
      fee: 5,
      timestamp: 10,
      signature: "",
    };
    signTransaction(transaction, wallet1.key);

    const transactions = [
      { ...transaction },
      { ...transaction },
      { ...transaction },
      { ...transaction },
      { ...transaction },
    ];

    const merkleRoot = getMerkleRoot(transactions);

    assert.equal(
      merkleRoot,
      "31d22b2bbb90e99f6add9e91f0332d6448496aa6fa4553fbc506ac782e954a36"
    );
  });

  it("should create a valid block", (context) => {
    context.mock.timers.enable({ apis: ["Date"], now: 100 });

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
        height: 0,
        timestamp: new Date().getTime(),
        previousHash: "",
        merkleRoot: getMerkleRoot(transactions),
        message: "Test block",
        nonce: 0,
        hash: "",
      },
      transactions,
    } as Block;

    block.header.hash = getBlockHash(block);

    assert.equal(isValidBlock(block), true);
  });

  it("should mine a block", (context) => {
    context.mock.timers.enable({ apis: ["Date"], now: 100 });

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

    const block = mineBlock({
      height: 0,
      previousHash: "",
      transactions,
      message: "Test block",
      difficulty: 0,
      reward: 100,
      minerAddress: walletMiner.address,
    });

    assert.deepStrictEqual(block.transactions[0], {
      fromAddress: "",
      toAddress: walletMiner.address,
      amount: 110,
      fee: 0,
      timestamp: 100,
      signature: "",
    });
    assert.equal(isValidBlock(block), true);
  });
});
