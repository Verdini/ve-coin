import * as crypto from "crypto";
import { Transaction } from "./Transaction";

export class Block {
  private previousHash: string;
  private nonce: number;
  private hash: string;

  constructor(
    private timestamp: number,
    private transactions: Transaction[],
    previousHash: string
  ) {
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = "";
  }

  get PreviousHash(): string {
    return this.previousHash;
  }

  get Transactions(): Transaction[] {
    return this.transactions;
  }

  get Timestamp(): number {
    return this.timestamp;
  }

  get Hash(): string {
    return this.hash;
  }

  set Nonce(nonce: number) {
    this.nonce = nonce;
  }

  set Hash(hash: string) {
    this.hash = hash;
  }

  get Nonce(): number {
    return this.nonce;
  }

  GenerateHash(): string {
    return crypto
      .createHash("sha256")
      .update(
        this.previousHash +
          this.timestamp +
          JSON.stringify(this.transactions) +
          this.nonce
      )
      .digest("hex");
  }

  IsValid() {
    // First transaction is the coinbase, not checked here

    for (let i = 1; i < this.transactions.length; i++) {
      if (!this.transactions[i].IsValid()) return false;
    }

    return true;
  }
}

export class GenesisBlock extends Block {
  constructor() {
    const transactions = [];
    super(new Date().getTime(), transactions, "");
  }
}
