import { Block, Blockchain, Transaction } from "../../lib/core";

export interface IBlockChainRepository {
  createTransaction(transactionRequest: Transaction): Transaction;
  getPendingTransactions(): Transaction[];
  mine(): void;
  isValidChain(): boolean;
  getBalance(address: string): number;
  getBlock(index: number): Block | null;
  getLastBlock(): Block;
}

export class BlockchainRepositoryMemory implements IBlockChainRepository {
  private blockchain: Blockchain;
  private pendingTransactions: Transaction[];

  constructor() {
    this.blockchain = new Blockchain();
    this.pendingTransactions = [];
  }

  createTransaction(transaction: Transaction): Transaction {
    this.pendingTransactions.push(transaction);
    return transaction;
  }

  getPendingTransactions(): Transaction[] {
    return this.pendingTransactions;
  }

  mine() {
    // TODO: mine the pending transactions
    //this.blockchain.AddBlock(this.pendingTransactions);
    this.pendingTransactions = [];
  }

  isValidChain() {
    return this.blockchain.IsValid();
  }

  getBalance(address: string): number {
    return this.blockchain.GetBalance(address);
  }

  getBlock(index: number): Block | null {
    return this.blockchain.GetBlock(index);
  }

  getLastBlock(): Block {
    return this.blockchain.GetLastBlock();
  }
}
