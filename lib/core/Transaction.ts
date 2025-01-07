import * as crypto from "crypto";
import { ec } from "elliptic";
const secp256k1 = new ec("secp256k1");

export type TransactionData = {
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee: number;
  timestamp: number;
  signature: string;
};

export type TransactionParams = Omit<TransactionData, "signature"> &
  Partial<Pick<TransactionData, "signature">>;

export class Transaction {
  private fromAddress: string;
  private toAddress: string;
  private amount: number;
  private fee: number;
  private timestamp: number;
  private signature?: string;

  constructor({
    fromAddress,
    toAddress,
    amount,
    fee,
    timestamp,
    signature,
  }: TransactionParams) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.fee = fee;
    this.timestamp = timestamp;
    this.signature = signature;
  }

  get FromAddress(): string {
    return this.fromAddress;
  }

  get ToAddress(): string {
    return this.toAddress;
  }

  get Amount(): number {
    return this.amount;
  }

  get Fee(): number {
    return this.fee;
  }

  get Timestamp(): number {
    return this.timestamp;
  }

  Hash(): string {
    return crypto
      .createHash("sha256")
      .update(
        this.fromAddress +
          this.toAddress +
          this.amount +
          this.fee +
          this.timestamp
      )
      .digest("hex");
  }

  Sign(privateKey: string) {
    const key = secp256k1.keyFromPrivate(privateKey);

    const signature = key.sign(this.Hash(), "base64");
    this.signature = signature.toDER("hex");
  }

  IsValid(): boolean {
    if (!this.signature || this.signature.length === 0) return false;

    const key = secp256k1.keyFromPublic(this.fromAddress, "hex");

    return key.verify(this.Hash(), this.signature);
  }

  ToJSON(): TransactionData {
    return {
      fromAddress: this.fromAddress,
      toAddress: this.toAddress,
      amount: this.amount,
      fee: this.fee,
      timestamp: this.timestamp,
      signature: this.signature || "",
    };
  }
}
