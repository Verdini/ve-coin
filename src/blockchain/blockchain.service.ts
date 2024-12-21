import { Blockchain, Transaction, Wallet } from "../../lib/core";
import {
  ErrorDTO,
  PendingTransactionsDTO,
  TransactionDTO,
  WalletDTO,
} from "./blockchain.dto";

export class BlockchainService {
  private blockchain: Blockchain;
  private pendingTransactions: Transaction[];

  constructor() {
    this.blockchain = new Blockchain();
    this.pendingTransactions = [];
  }

  createWallet(): WalletDTO {
    const wallet = new Wallet();
    return {
      address: wallet.Address,
      key: wallet.Key,
    };
  }

  createTransaction(
    transactionRequest: TransactionDTO
  ): TransactionDTO | ErrorDTO {
    const transaction = new Transaction(transactionRequest);

    if (!transaction.IsValid()) {
      return {
        message: "Invalid transaction",
      };
    }

    // TODO: check if the sender has enough balance

    this.pendingTransactions.push(transaction);

    return transaction.ToJSON();
  }

  getPendingTransactions(): PendingTransactionsDTO {
    const pendingTransactions = this.pendingTransactions.map((transaction) =>
      transaction.ToJSON()
    );

    return {
      transactions: pendingTransactions,
    };
  }
}
