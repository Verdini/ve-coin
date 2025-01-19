import {
  Block,
  Blockchain,
  buildBlockchain,
  DefaultConsensus,
  Transaction,
} from "../../lib/core/index.ts";

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

  constructor() {
    this.blockchain = buildBlockchain({ consensus: DefaultConsensus });
  }

  createTransaction(transaction: Transaction): Transaction {
    this.blockchain.addToMemPool([transaction]);
    return transaction;
  }

  getPendingTransactions(): Transaction[] {
    return this.blockchain.getMemPool();
  }

  mine() {
    // TODO: mine the pending transactions
    //this.blockchain.AddBlock(this.pendingTransactions);
  }

  isValidChain() {
    return this.blockchain.isValid();
  }

  getBalance(address: string): number {
    return this.blockchain.getBalance(address);
  }

  getBlock(index: number): Block | null {
    return this.blockchain.getBlock(index);
  }

  getLastBlock(): Block {
    return this.blockchain.getLastBlock();
  }
}
