import * as crypto from "crypto";
import { isValidTransaction, Transaction } from "./Transaction";

export interface BlockHeader {
  timestamp: number;
  previousHash: string;
  message: string;
  nonce: number;
  hash: string;
}

export interface Block {
  header: BlockHeader;
  transactions: Transaction[];
}

export function getBlockHash(block: Block): string {
  return crypto
    .createHash("sha256")
    .update(
      block.header.previousHash +
        block.header.timestamp +
        block.header.message +
        block.header.nonce +
        JSON.stringify(block.transactions)
    )
    .digest("hex");
}

export function isValidBlock(block: Block): boolean {
  if (block.transactions.length === 0) return false;

  for (let i = 1; i < block.transactions.length; i++) {
    if (!isValidTransaction(block.transactions[i])) return false;
  }

  return true;
}

export function buildGenesisBlock(): Block {
  const block: Block = {
    header: {
      timestamp: new Date().getTime(),
      previousHash: "",
      message: "Genesis Block",
      nonce: 0,
      hash: "",
    },
    transactions: [],
  };
  block.header.hash = getBlockHash(block);
  return block;
}

export function mineBlock({
  previousHash,
  transactions,
  message,
  difficulty,
  reward,
  minerAddress,
}: {
  previousHash: string;
  transactions: Transaction[];
  message: string;
  difficulty: number;
  reward: number;
  minerAddress: string;
}): Block {
  const timestamp = new Date().getTime();

  const feeAmount = transactions.reduce((acc, tx) => acc + tx.fee, 0);

  const coinbaseTx = {
    fromAddress: "",
    toAddress: minerAddress,
    amount: reward + feeAmount,
    fee: 0,
    timestamp,
    signature: "",
  };

  const blockTransactions = [coinbaseTx, ...transactions];

  const block: Block = {
    header: {
      timestamp,
      previousHash,
      message,
      nonce: 0,
      hash: "",
    },
    transactions: blockTransactions,
  };

  let hash = "";
  while (
    // while the hash doesn't start with enough zeros
    hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
  ) {
    block.header.nonce++;
    hash = getBlockHash(block);
  }

  block.header.hash = hash;

  return block;
}
