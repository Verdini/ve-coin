export type BlockchainError = {
  code: string;
  message: string;
};

export const InvalidTransactionError: BlockchainError = {
  code: "INVALID_TRANSACTION",
  message: "Invalid transaction",
};

export const InsufficientBalanceError: BlockchainError = {
  code: "INSUFFICIENT_BALANCE",
  message: "Insufficient balance",
};

export const InvalidBlockError: BlockchainError = {
  code: "INVALID_BLOCK",
  message: "Invalid block",
};
