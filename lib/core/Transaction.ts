import * as crypto from "node:crypto";
import elliptic from "elliptic";
const secp256k1 = new elliptic.ec("secp256k1");

export interface Transaction {
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee: number;
  timestamp: number;
  signature: string;
}

export function getTransactionHash(transaction: Transaction): string {
  return crypto
    .createHash("sha256")
    .update(
      transaction.fromAddress +
        transaction.toAddress +
        transaction.amount +
        transaction.fee +
        transaction.timestamp
    )
    .digest("hex");
}

export function signTransaction(
  transaction: Transaction,
  privateKey: string
): void {
  const key = secp256k1.keyFromPrivate(privateKey);
  const signature = key.sign(getTransactionHash(transaction), "base64");
  transaction.signature = signature.toDER("hex");
}

export function isValidTransaction(transaction: Transaction): boolean {
  if (!transaction.signature || transaction.signature.length === 0)
    return false;

  if (transaction.amount <= 0 || transaction.fee <= 0) return false;

  if (transaction.fromAddress === transaction.toAddress) return false;

  const key = secp256k1.keyFromPublic(transaction.fromAddress, "hex");
  return key.verify(getTransactionHash(transaction), transaction.signature);
}
