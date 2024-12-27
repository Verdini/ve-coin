import { Block, Transaction, Wallet } from "../../lib/core";
import {
  ErrorDTO,
  PendingTransactionsDTO,
  TransactionDTO,
  WalletDTO,
} from "./blockchain.dto";
import { IBlockChainRepository } from "./blockchain.repository";

export class BlockchainService {
  private blockchainRepo: IBlockChainRepository;

  constructor(blockchainRepo: IBlockChainRepository) {
    this.blockchainRepo = blockchainRepo;
  }

  createWallet(): WalletDTO {
    const wallet = new Wallet();
    return {
      address: wallet.Address,
      key: wallet.Key,
    };
  }

  async createTransaction(
    transactionRequest: TransactionDTO
  ): Promise<TransactionDTO | ErrorDTO> {
    const transaction = new Transaction(transactionRequest);

    if (!transaction.IsValid()) {
      return {
        message: "Invalid transaction",
      };
    }

    // TODO: check if the sender has enough balance

    const createdTransaction = await this.blockchainRepo.createTransaction(
      transaction
    );

    return createdTransaction.ToJSON();
  }

  async getPendingTransactions(): Promise<PendingTransactionsDTO> {
    const pendingTransactions = this.blockchainRepo
      .getPendingTransactions()
      .map((transaction) => transaction.ToJSON());

    return {
      transactions: pendingTransactions,
    };
  }

  async mine() {
    //TODO: create a new block with pending transactions
    // validate and add to the blockchain
    await this.blockchainRepo.mine();
  }

  async isValidChain() {
    return await this.blockchainRepo.isValidChain();
  }

  async getBalance(address: string) {
    return await this.blockchainRepo.getBalance(address);
  }

  async getBlock(index: number): Promise<Block | null> {
    return await this.blockchainRepo.getBlock(index);
  }

  async getLastBlock(): Promise<Block> {
    return await this.blockchainRepo.getLastBlock();
  }
}
