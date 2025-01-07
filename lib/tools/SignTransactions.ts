/**
 * This script is used to sign transactions and print them in JSON format.
 */

import { Transaction } from "../core";

const plainTransactions = [
  {
    fromAddress: "",
    toAddress: "",
    amount: 50,
    fee: 5,
    timestamp: 1736001160,
    privateKey: "",
  },
];

for (const plainTransaction of plainTransactions) {
  const transaction = new Transaction(plainTransaction);
  transaction.Sign(plainTransaction.privateKey);
  console.info(transaction.ToJSON());
}
