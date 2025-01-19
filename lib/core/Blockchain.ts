import { Block, buildGenesisBlock, isValidBlock } from "./Block.ts";
import { Consensus } from "./Consensus.ts";
import { Transaction } from "./Transaction.ts";

export interface Blockchain {
  getDifficulty: () => number;
  getMiningReward: () => number;
  getBlock: (index: number) => Block | null;
  getLastBlock: () => Block;
  addBlock: (block: Block) => boolean;
  getMemPool: () => Transaction[];
  addToMemPool: (transactions: Transaction[]) => void;
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

  function addBlock(block: Block): boolean {
    if (!isValidBlock(block)) return false;
    // TO DO: check hash under difficulty
    if (block.header.previousHash !== getLastBlock().header.hash) return false;
    chain.push(block);
    return true;
  }

  function getMemPool(): Transaction[] {
    return memPool.splice(0, memPool.length);
  }

  function addToMemPool(transactions: Transaction[]): void {
    memPool.push(...transactions);
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
    getMemPool,
    addToMemPool,
    getBalance,
    isValid,
  };
}
