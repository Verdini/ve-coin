export const CreateTransactionSchema = {
  body: {
    type: "object",
    required: ["fromAddress", "toAddress", "amount", "fee", "signature"],
    properties: {
      fromAddress: { type: "string" },
      toAddress: { type: "string" },
      amount: { type: "number" },
      fee: { type: "number" },
      timestamp: { type: "number" },
      signature: { type: "string" },
    },
  },
};
