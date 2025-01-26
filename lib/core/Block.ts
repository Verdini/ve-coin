import * as crypto from "node:crypto";
import {
  getTransactionHash,
  isValidTransaction,
  Transaction,
} from "./Transaction";

export interface BlockHeader {
  height: number;
  timestamp: number;
  previousHash: string;
  merkleRoot: string;
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
      block.header.height +
        block.header.previousHash +
        block.header.timestamp +
        block.header.merkleRoot +
        block.header.message +
        block.header.nonce
    )
    .digest("hex");
}

export function isValidBlock(block: Block): boolean {
  if (block.transactions.length === 0) return false;

  if (block.header.hash !== getBlockHash(block)) return false;

  const merkleRoot = getMerkleRoot(block.transactions);
  if (block.header.merkleRoot !== merkleRoot) return false;

  for (let i = 1; i < block.transactions.length; i++) {
    if (!isValidTransaction(block.transactions[i])) return false;
  }

  return true;
}

export function buildGenesisBlock(): Block {
  const block: Block = {
    header: {
      height: 0,
      timestamp: new Date().getTime(),
      previousHash: "",
      merkleRoot: "",
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
  height,
  previousHash,
  transactions,
  message,
  difficulty,
  reward,
  minerAddress,
}: {
  height: number;
  previousHash: string;
  transactions: Transaction[];
  message: string;
  difficulty: number;
  reward: number;
  minerAddress: string;
}): Block {
  const timestamp = new Date().getTime();

  const coinbaseTx = getCoinbaseTransaction(
    timestamp,
    transactions,
    reward,
    minerAddress
  );

  const blockTransactions = [coinbaseTx, ...transactions];

  const merkleRoot = getMerkleRoot(blockTransactions);

  const block: Block = {
    header: {
      height,
      timestamp,
      previousHash,
      merkleRoot,
      message,
      nonce: 0,
      hash: "",
    },
    transactions: blockTransactions,
  };

  let hash = getBlockHash(block);
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

function getCoinbaseTransaction(
  timestamp: number,
  transactions: Transaction[],
  reward: number,
  minerAddress: string
): Transaction {
  const feeAmount = transactions.reduce((acc, tx) => acc + tx.fee, 0);

  return {
    fromAddress: "",
    toAddress: minerAddress,
    amount: reward + feeAmount,
    fee: 0,
    timestamp,
    signature: "",
  };
}

export function getMerkleRoot(transactions: Transaction[]): string {
  if (transactions.length === 0) return "";

  let hashes = transactions.map((tx) => getTransactionHash(tx));

  while (hashes.length > 1) {
    let nextHashes: string[] = [];

    for (let i = 0; i < hashes.length; i += 2) {
      const hash1 = hashes[i];
      const hash2 = i + 1 < hashes.length ? hashes[i + 1] : "";

      const merkleBranchHash = crypto
        .createHash("sha256")
        .update(hash1 + hash2)
        .digest("hex");

      nextHashes.push(merkleBranchHash);
    }
    hashes = nextHashes;
  }

  return hashes[0];
}
