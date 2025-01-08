export type WalletDTO = {
  address: string;
  key: string;
};

export type TransactionDTO = {
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee: number;
  timestamp: number;
  signature: string;
};

export type PendingTransactionsDTO = {
  transactions: TransactionDTO[];
};

export type ErrorDTO = {
  message: string;
};
