import { before, describe, it } from "node:test";
import { Wallet } from "../Wallet";
import assert from "node:assert";
import { Blockchain, buildBlockchain } from "../Blockchain";
import fixtures from "./fixtures/blockchain.fixtures.json" with { type: "json" };
import { mineBlock } from "../Block";

describe("Core Blockchain tests", () => {
  let blockchain: Blockchain;
  let walletMiner: Wallet;
  let wallet1: Wallet;
  let wallet2: Wallet;
  let wallet3: Wallet;

  before(() => {
    blockchain = buildBlockchain({
      consensus: fixtures.consensus,
    });

    walletMiner = fixtures.wallets[0];
    wallet1 = fixtures.wallets[1];
    wallet2 = fixtures.wallets[2];
    wallet3 = fixtures.wallets[3];

    // Mine first empty block and get 100 coins
    const block = mineBlock({
      height: 0,
      previousHash: blockchain.getLastBlock().header.hash,
      transactions: [],
      message: "First mined empty block",
      difficulty: blockchain.getDifficulty(),
      reward: blockchain.getMiningReward(),
      minerAddress: walletMiner.address,
    });
    blockchain.addBlock(block);

    // Mine second empty block and get 100 coins
    const block2 = mineBlock({
      height: 1,
      previousHash: blockchain.getLastBlock().header.hash,
      transactions: [],
      message: "Second mined empty block",
      difficulty: blockchain.getDifficulty(),
      reward: blockchain.getMiningReward(),
      minerAddress: walletMiner.address,
    });
    blockchain.addBlock(block2);

    // Mine third empty block and get 100 coins
    const block3 = mineBlock({
      height: 2,
      previousHash: blockchain.getLastBlock().header.hash,
      transactions: [],
      message: "Third mined empty block",
      difficulty: blockchain.getDifficulty(),
      reward: blockchain.getMiningReward(),
      minerAddress: walletMiner.address,
    });
    blockchain.addBlock(block3);

    // Blockchain changes difficulty to 2 and mining reward to 50

    // Add transactions to mempool and mine the block
    blockchain.addToMemPool(fixtures.transactions[0]);
    blockchain.addToMemPool(fixtures.transactions[1]);
    const block4 = mineBlock({
      height: 3,
      previousHash: blockchain.getLastBlock().header.hash,
      transactions: blockchain.takeFromMemPool(),
      message: "Fourth mined empty block",
      difficulty: blockchain.getDifficulty(),
      reward: blockchain.getMiningReward(),
      minerAddress: walletMiner.address,
    });
    blockchain.addBlock(block4);

    // Add transactions to mempool and mine the block
    blockchain.addToMemPool(fixtures.transactions[2]);
    blockchain.addToMemPool(fixtures.transactions[3]);
    const block5 = mineBlock({
      height: 4,
      previousHash: blockchain.getLastBlock().header.hash,
      transactions: blockchain.takeFromMemPool(),
      message: "Fifth mined empty block",
      difficulty: blockchain.getDifficulty(),
      reward: blockchain.getMiningReward(),
      minerAddress: walletMiner.address,
    });
    blockchain.addBlock(block5);
  });

  it("should check valid blockchain", () => {
    assert.equal(blockchain.isValid(), true);
  });

  it("should get the last block", () => {
    const lastBlock = blockchain.getLastBlock();
    assert.notEqual(lastBlock, null);
  });

  it("should get an specific block", () => {
    const block = blockchain.getBlock(0);
    assert.notEqual(block, null);
  });

  it("should get the balance of the wallets", () => {
    assert.equal(blockchain.getBalance(walletMiner.address), 310);
    assert.equal(blockchain.getBalance(wallet1.address), 20);
    assert.equal(blockchain.getBalance(wallet2.address), 20);
    assert.equal(blockchain.getBalance(wallet3.address), 50);
  });

  it("should check difficulty and mining reward", () => {
    const difficulty = blockchain.getDifficulty();
    const miningReward = blockchain.getMiningReward();

    assert.equal(difficulty, 2);
    assert.equal(miningReward, 50);
  });
});
