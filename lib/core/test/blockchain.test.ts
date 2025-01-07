import { before, describe, it } from "node:test";
import { Wallet } from "../Wallet";
import { Transaction } from "../Transaction";
import assert from "node:assert";
import { Blockchain } from "../Blockchain";
import { Miner } from "../Miner";
import fixtures from "./fixtures/blockchain.fixtures.json";

describe("Core Blockchain tests", () => {
  let blockchain: Blockchain;
  let miner: Miner;
  let walletMiner: Wallet;
  let wallet1: Wallet;
  let wallet2: Wallet;
  let wallet3: Wallet;

  const initWallets = () => {
    const wallets = fixtures.wallets;

    walletMiner = new Wallet(wallets[0].address, wallets[0].privateKey);
    wallet1 = new Wallet(wallets[1].address, wallets[1].privateKey);
    wallet2 = new Wallet(wallets[2].address, wallets[2].privateKey);
    wallet3 = new Wallet(wallets[3].address, wallets[3].privateKey);
  };

  before(() => {
    blockchain = new Blockchain(fixtures.consensus);
    blockchain.Init();

    initWallets();

    miner = new Miner(walletMiner);

    // Mine first empty block and get 100 coins
    const block = miner.Mine(
      blockchain.GetLastBlock().Hash,
      [],
      "First mined empty block",
      blockchain.Difficulty,
      blockchain.MiningReward
    );
    blockchain.AddBlock(block);

    // Mine second empty block and get 100 coins
    const block2 = miner.Mine(
      blockchain.GetLastBlock().Hash,
      [],
      "Second mined empty block",
      blockchain.Difficulty,
      blockchain.MiningReward
    );
    blockchain.AddBlock(block2);

    // Mine third empty block and get 100 coins
    const block3 = miner.Mine(
      blockchain.GetLastBlock().Hash,
      [],
      "Third mined empty block",
      blockchain.Difficulty,
      blockchain.MiningReward
    );
    // Miner gets 100 coins as reward for mining the empty block
    blockchain.AddBlock(block3);

    // Blockchain changes difficulty to 2 and mining reward to 50

    // Add transactions to mempool and mine the block
    blockchain.AddTransactionsMemPool([
      new Transaction(fixtures.transactions[0]),
      new Transaction(fixtures.transactions[1]),
    ]);
    const block4 = miner.Mine(
      blockchain.GetLastBlock().Hash,
      blockchain.GetMemPoolTransactions(),
      "Fourth mined block",
      blockchain.Difficulty,
      blockchain.MiningReward
    );
    blockchain.AddBlock(block4);

    // Add transactions to mempool and mine the block
    blockchain.AddTransactionsMemPool([
      new Transaction(fixtures.transactions[2]),
      new Transaction(fixtures.transactions[3]),
    ]);
    const block5 = miner.Mine(
      blockchain.GetLastBlock().Hash,
      blockchain.GetMemPoolTransactions(),
      "Fifth mined block",
      blockchain.Difficulty,
      blockchain.MiningReward
    );
    blockchain.AddBlock(block5);
  });

  it("should check valid blockchain", () => {
    assert.equal(blockchain.IsValid(), true);
  });

  it("should get the last block", () => {
    const lastBlock = blockchain.GetLastBlock();
    assert.notEqual(lastBlock, null);
  });

  it("should get an specific block", () => {
    const block = blockchain.GetBlock(0);
    assert.notEqual(block, null);
  });

  it("should get the balance of the wallets", () => {
    assert.equal(blockchain.GetBalance(walletMiner.Address), 310);
    assert.equal(blockchain.GetBalance(wallet1.Address), 20);
    assert.equal(blockchain.GetBalance(wallet2.Address), 20);
    assert.equal(blockchain.GetBalance(wallet3.Address), 50);
  });

  it("should check difficulty and mining reward", () => {
    const difficulty = blockchain.Difficulty;
    const miningReward = blockchain.MiningReward;

    assert.equal(difficulty, 2);
    assert.equal(miningReward, 50);
  });
});
