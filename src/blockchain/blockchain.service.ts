import { Block, buildWallet, isValidTransaction } from "../../lib/core/index";
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
    const { address, key } = buildWallet();
    return {
      address,
      key,
    };
  }

  async createTransaction(
    transactionRequest: TransactionDTO
  ): Promise<TransactionDTO | ErrorDTO> {
    const transaction = { ...transactionRequest };

    if (!isValidTransaction(transaction)) {
      return {
        message: "Invalid transaction",
      };
    }

    // TODO: check if the sender has enough balance

    const createdTransaction = await this.blockchainRepo.createTransaction(
      transaction
    );

    return createdTransaction;
  }

  getPendingTransactions(): PendingTransactionsDTO {
    const pendingTransactions = this.blockchainRepo.getPendingTransactions();

    return {
      transactions: pendingTransactions as TransactionDTO[],
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
