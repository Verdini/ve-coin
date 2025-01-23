import { Block, buildGenesisBlock, isValidBlock } from "./Block";
import { Consensus } from "./Consensus";
import {
  BlockchainError,
  InsufficientBalanceError,
  InvalidBlockError,
  InvalidTransactionError,
} from "./Errors";
import { isValidTransaction, Transaction } from "./Transaction";

export interface Blockchain {
  getDifficulty: () => number;
  getMiningReward: () => number;
  getBlock: (index: number) => Block | null;
  getLastBlock: () => Block;
  addBlock: (block: Block) => BlockchainError | null;
  takeFromMemPool: () => Transaction[];
  getMemPool: () => Transaction[];
  addToMemPool: (transaction: Transaction) => BlockchainError | null;
  getBalance: (address: string) => number;
  isValid: () => boolean;
}

export function buildBlockchain({
  consensus,
}: {
  consensus: Consensus;
}): Blockchain {
  const chain: Block[] = [buildGenesisBlock()];
  const memPool: Transaction[] = [];

  function getDifficulty(): number {
    return (
      consensus.initialDifficulty +
      consensus.difficultyStep *
        Math.floor(chain.length / consensus.blockInterval)
    );
  }

  function getMiningReward(): number {
    return (
      consensus.initialMiningReward /
      Math.pow(
        consensus.miningRewardStep,
        Math.floor(chain.length / consensus.blockInterval)
      )
    );
  }

  function getBlock(index: number): Block | null {
    if (index < 0 || index >= chain.length) return null;
    return chain[index];
  }

  function getLastBlock(): Block {
    return chain[chain.length - 1];
  }

  function addBlock(block: Block): BlockchainError | null {
    if (!isValidBlock(block)) return InvalidBlockError;

    if (block.header.previousHash !== getLastBlock().header.hash)
      return InvalidBlockError;

    // TO DO: check hash under difficulty
    // TO DO: check balances

    chain.push(block);
    return null;
  }

  function takeFromMemPool(): Transaction[] {
    return memPool.splice(0, memPool.length);
  }

  function getMemPool(): Transaction[] {
    return memPool;
  }

  function addToMemPool(transaction: Transaction): BlockchainError | null {
    if (!isValidTransaction(transaction)) {
      return InvalidTransactionError;
    }

    const balance = getBalance(transaction.fromAddress);
    if (balance < transaction.amount + transaction.fee) {
      return InsufficientBalanceError;
    }

    memPool.push(transaction);
    return null;
  }

  function isValid(): boolean {
    for (let i = 1; i < chain.length; i++) {
      if (!isValidBlock(chain[i])) return false;
      if (chain[i].header.previousHash !== chain[i - 1].header.hash)
        return false;
    }
    return true;
  }

  function getBalance(address: string): number {
    let balance = 0;
    for (const block of chain) {
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

  return {
    getDifficulty,
    getMiningReward,
    getBlock,
    getLastBlock,
    addBlock,
    takeFromMemPool,
    getMemPool,
    addToMemPool,
    getBalance,
    isValid,
  };
}
