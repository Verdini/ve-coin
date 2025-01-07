import { Block, GenesisBlock } from "./Block";
import { IConsensus } from "./Consensus";
import { Transaction } from "./Transaction";

export class Blockchain {
  private chain: Block[];
  private memPool: Transaction[];
  private consensus: IConsensus;

  constructor(consensus: IConsensus) {
    this.chain = [];
    this.memPool = [];
    this.consensus = consensus;
  }

  Init() {
    this.chain = [new GenesisBlock()];
  }

  get Difficulty(): number {
    return (
      this.consensus.InitialDifficulty +
      this.consensus.DifficultyStep *
        Math.floor(this.chain.length / this.consensus.BlockInterval)
    );
  }

  get MiningReward(): number {
    return (
      this.consensus.InitialMiningReward /
      Math.pow(2, Math.floor(this.chain.length / this.consensus.BlockInterval))
    );
  }

  GetMemPoolTransactions(): Transaction[] {
    const pendingTransactions = this.memPool;
    this.memPool = [];
    return pendingTransactions;
  }

  AddTransactionsMemPool(transactions: Transaction[]): void {
    this.memPool.push(...transactions);
  }

  AddBlock(block: Block): boolean {
    if (!block.IsValid()) return false;
    if (block.PreviousHash !== this.GetLastBlock().Hash) return false;
    // TODO: check block details, such as coinbase transaction

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

      if (currentBlock.PreviousHash !== previousBlock.Hash) {
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
          balance -= transaction.Amount + transaction.Fee;
        }

        if (transaction.ToAddress === address) {
          balance += transaction.Amount;
        }
      }
    }

    return balance;
  }

  GetWalletTransactions(address: string): Transaction[] {
    const transactions: Transaction[] = [];

    for (const block of this.chain) {
      for (const transaction of block.Transactions) {
        if (
          transaction.FromAddress === address ||
          transaction.ToAddress === address
        ) {
          transactions.push(transaction);
        }
      }
    }

    return transactions;
  }
}
