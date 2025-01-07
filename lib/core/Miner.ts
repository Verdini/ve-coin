import { Block } from "./Block";
import { Transaction } from "./Transaction";
import { Wallet } from "./Wallet";

export class Miner {
  private wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  Mine(
    previousHash: string,
    transactions: Transaction[],
    message: string,
    difficulty: number, // number of zeros at the beginning of the hash
    reward: number
  ): Block {
    // TODO: check if accounts have valid balance

    const timestamp = new Date().getTime();

    const feeAmount = transactions.reduce((acc, tx) => acc + tx.Fee, 0);

    const coinbaseTx = new Transaction({
      fromAddress: "",
      toAddress: this.wallet.Address,
      amount: reward + feeAmount,
      fee: 0,
      timestamp,
    });
    transactions.unshift(coinbaseTx);

    // TODO: implement fee to miner

    const block = new Block(timestamp, transactions, previousHash, message);

    let hash = "";
    while (
      // while the hash doesn't start with enough zeros
      hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      block.Nonce++;
      hash = block.GenerateHash();
    }

    block.Hash = hash;

    return block;
  }
}
