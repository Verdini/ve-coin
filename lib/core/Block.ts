import * as crypto from "crypto";
import { Transaction } from "./Transaction";

export class Block {
  private previousHash: string;
  private nonce: number;
  private hash: string;

  constructor(
    private timestamp: Date,
    private transactions: Transaction[],
    previousHash: string = ""
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

  Hash(): string {
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

  mine(difficulty: number): string {
    let hash = "";
    while (
      this.Hash().substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      hash = this.Hash();
    }

    return hash;
  }

  IsValid() {
    for (const tx of this.transactions) if (!tx.IsValid()) return false;

    return true;
  }
}

export class GenesisBlock extends Block {
  constructor() {
    const transactions = [];
    super(new Date(), transactions);
  }
}
