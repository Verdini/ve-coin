import { Block, buildGenesisBlock, isValidBlock } from "./Block";
import { Consensus } from "./Consensus";
import { Transaction } from "./Transaction";

export interface Blockchain {
  chain: Block[];
  memPool: Transaction[];
  consensus: Consensus;
}

export function buildBlockchain(consensus: Consensus): Blockchain {
  return {
    chain: [buildGenesisBlock()],
    memPool: [],
    consensus,
  };
}

export function getBlockchainDifficulty(blockchain: Blockchain): number {
  return (
    blockchain.consensus.initialDifficulty +
    blockchain.consensus.difficultyStep *
      Math.floor(blockchain.chain.length / blockchain.consensus.blockInterval)
  );
}

export function getBlockchainMiningReward(blockchain: Blockchain): number {
  return (
    blockchain.consensus.initialMiningReward /
    Math.pow(
      blockchain.consensus.miningRewardStep,
      Math.floor(blockchain.chain.length / blockchain.consensus.blockInterval)
    )
  );
}

export function getBlock(blockchain: Blockchain, index: number): Block | null {
  if (index < 0 || index >= blockchain.chain.length) return null;
  return blockchain.chain[index];
}

export function getLastBlock(blockchain: Blockchain): Block {
  return blockchain.chain[blockchain.chain.length - 1];
}

export function getMemPool(blockchain: Blockchain): Transaction[] {
  const pendingTransactions = blockchain.memPool;
  blockchain.memPool = [];
  return pendingTransactions;
}

export function AddToMemPool(
  blockchain: Blockchain,
  transactions: Transaction[]
): void {
  blockchain.memPool.push(...transactions);
}

export function AddToBlockchain(blockchain: Blockchain, block: Block): boolean {
  if (!isValidBlock(block)) return false;
  if (block.header.previousHash !== getLastBlock(blockchain).header.hash)
    return false;

  blockchain.chain.push(block);

  return true;
}

export function isValidBlockchain(blockchain: Blockchain): boolean {
  for (let i = 1; i < blockchain.chain.length; i++) {
    if (!isValidBlock(blockchain.chain[i])) return false;
    if (
      blockchain.chain[i].header.previousHash !==
      blockchain.chain[i - 1].header.hash
    )
      return false;
  }

  return true;
}

export function getBalance(blockchain: Blockchain, address: string): number {
  let balance = 0;

  for (const block of blockchain.chain) {
    for (const transaction of block.transactions) {
      if (transaction.fromAddress === address) {
        balance -= transaction.amount + transaction.fee;
      }

      if (transaction.toAddress === address) {
        balance += transaction.amount;
      }
    }
  }

  return balance;
}

export function getWalletTransactions(
  blockchain: Blockchain,
  address: string
): Transaction[] {
  const transactions: Transaction[] = [];

  for (const block of blockchain.chain) {
    for (const transaction of block.transactions) {
      if (
        transaction.fromAddress === address ||
        transaction.toAddress === address
      ) {
        transactions.push(transaction);
      }
    }
  }

  return transactions;
}
