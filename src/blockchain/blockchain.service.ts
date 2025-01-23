import {
  Block,
  Blockchain,
  buildWallet,
  isValidTransaction,
  mineBlock,
} from "../../lib/core/index";
import {
  BalanceDTO,
  BlockchainValidationDTO,
  ErrorDTO,
  MineDTO,
  PendingTransactionsDTO,
  TransactionDTO,
  WalletDTO,
} from "./blockchain.dto";

export class BlockchainService {
  constructor(private blockchain: Blockchain) {}

  createWallet(): WalletDTO {
    const { address, key } = buildWallet();
    return {
      address,
      key,
    };
  }

  createTransaction(
    transactionRequest: TransactionDTO
  ): TransactionDTO | ErrorDTO {
    const transaction = { ...transactionRequest };
    const error = this.blockchain.addToMemPool(transaction);
    return error || transaction;
  }

  getPendingTransactions(): PendingTransactionsDTO {
    const pendingTransactions = this.blockchain.getMemPool();

    return {
      transactions: pendingTransactions as TransactionDTO[],
    };
  }

  mine({ minerAddress, message }: MineDTO): ErrorDTO | null {
    const transactions = this.blockchain.takeFromMemPool();
    const lastBlock = this.blockchain.getLastBlock();
    const difficulty = this.blockchain.getDifficulty();
    const reward = this.blockchain.getMiningReward();

    const newBlock = mineBlock({
      previousHash: lastBlock.header.hash,
      transactions,
      message,
      difficulty,
      reward,
      minerAddress,
    });

    return this.blockchain.addBlock(newBlock);
  }

  isValidChain(): BlockchainValidationDTO {
    return {
      isValid: this.blockchain.isValid(),
    };
  }

  getBalance(address: string): BalanceDTO {
    const balance = this.blockchain.getBalance(address);
    return { address, balance };
  }

  getBlock(index: number): Block | null {
    return this.blockchain.getBlock(index);
  }

  getLastBlock(): Block {
    return this.blockchain.getLastBlock();
  }
}
