import { Block, GenesisBlock } from "./Block";
import * as Consensus from "./Consensus";

export class Blockchain {
  private chain: Block[];
  private difficulty: number;
  private miningReward: number;

  constructor() {
    this.chain = [];
    this.difficulty = Consensus.Difficulty;
    this.miningReward = Consensus.MiningReward;
  }

  Init() {
    this.chain = [];
    const genesisBlock = new GenesisBlock();
    this.AddBlock(genesisBlock);
  }

  AddBlock(block: Block): boolean {
    if (!block.IsValid()) return false;
    if (block.PreviousHash !== this.GetLastBlock().Hash()) return false;

    this.chain.push(block);
    return true;
  }

  GetBlock(index: number): Block | null {
    if (index < 0 || index >= this.chain.length) return null;
    return this.chain[index];
  }

  GetLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  IsValid(): boolean {
    // First block is the genesis block, so we don't need to check it
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.IsValid()) return false;

      if (currentBlock.PreviousHash !== previousBlock.Hash()) {
        return false;
      }
    }

    return true;
  }

  GetBalance(address: string): number {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.Transactions) {
        if (transaction.FromAddress === address) {
          balance -= transaction.Amount;
        }

        if (transaction.ToAddress === address) {
          balance += transaction.Amount;
        }
      }
    }

    return balance;
  }
}
