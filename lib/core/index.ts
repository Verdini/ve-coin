// Vecoin core interface
// Exports all core modules necessary to use Vecoin
// Users should only import this file to use Vecoin

export type { Wallet } from "./Wallet";
export { buildWallet } from "./Wallet";

export type { Transaction } from "./Transaction";
export {
  getTransactionHash,
  signTransaction,
  isValidTransaction,
} from "./Transaction";

export type { Block, BlockHeader } from "./Block";
export {
  getBlockHash,
  isValidBlock,
  buildGenesisBlock,
  mineBlock,
} from "./Block";

export type { Blockchain } from "./Blockchain";
export { buildBlockchain } from "./Blockchain";

export { DefaultConsensus } from "./Consensus";

export type { BlockchainError } from "./Errors";
export * from "./Errors";
