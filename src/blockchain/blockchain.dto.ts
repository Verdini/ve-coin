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

export type MineDTO = {
  minerAddress: string;
  message: string;
};

export type BalanceDTO = {
  address: string;
  balance: number;
};

export type BlockchainValidationDTO = {
  isValid: boolean;
};

export type ErrorDTO = {
  code: string;
  message: string;
};
