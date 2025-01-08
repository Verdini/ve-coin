/**
 * This script is used to sign transactions and print them in JSON format.
 */

import { signTransaction, Transaction } from "../core";

const transactions: Transaction[] = [
  {
    fromAddress: "",
    toAddress: "",
    amount: 50,
    fee: 5,
    timestamp: 1736001160,
    signature: "",
  },
];

const privateKey = "";

for (const transaction of transactions) {
  signTransaction(transaction, privateKey);
  console.info(transaction);
}
