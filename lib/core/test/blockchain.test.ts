import { before, describe, it } from "node:test";
import { Wallet } from "../Wallet";
import assert from "node:assert";
import { Blockchain, buildBlockchain } from "../Blockchain";
import fixtures from "./fixtures/blockchain.fixtures.json";
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

    const wallets = fixtures.wallets;
    walletMiner = { address: wallets[0].address, key: wallets[0].privateKey };
    wallet1 = { address: wallets[1].address, key: wallets[1].privateKey };
    wallet2 = { address: wallets[2].address, key: wallets[2].privateKey };
    wallet3 = { address: wallets[3].address, key: wallets[3].privateKey };

    // Mine first empty block and get 100 coins
    const block = mineBlock({
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
    blockchain.addToMemPool([
      fixtures.transactions[0],
      fixtures.transactions[1],
    ]);
    const block4 = mineBlock({
      previousHash: blockchain.getLastBlock().header.hash,
      transactions: blockchain.getMemPool(),
      message: "Fourth mined empty block",
      difficulty: blockchain.getDifficulty(),
      reward: blockchain.getMiningReward(),
      minerAddress: walletMiner.address,
    });
    blockchain.addBlock(block4);

    // Add transactions to mempool and mine the block
    blockchain.addToMemPool([
      fixtures.transactions[2],
      fixtures.transactions[3],
    ]);
    const block5 = mineBlock({
      previousHash: blockchain.getLastBlock().header.hash,
      transactions: blockchain.getMemPool(),
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
