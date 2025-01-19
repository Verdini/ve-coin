// Vecoin core interface
// Exports all core modules necessary to use Vecoin
// Users should only import this file to use Vecoin

export type { Wallet } from "./Wallet.ts";
export { buildWallet } from "./Wallet.ts";

export type { Transaction } from "./Transaction.ts";
export {
  getTransactionHash,
  signTransaction,
  isValidTransaction,
} from "./Transaction.ts";

export type { Block, BlockHeader } from "./Block.ts";
export {
  getBlockHash,
  isValidBlock,
  buildGenesisBlock,
  mineBlock,
} from "./Block.ts";

export type { Blockchain } from "./Blockchain.ts";
export { buildBlockchain } from "./Blockchain.ts";

export { DefaultConsensus } from "./Consensus.ts";
