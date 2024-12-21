export const CreateWalletSchema = {
  description: "Create a wallet",
  tags: ["Wallets"],
  summary: "Create a wallet",
  response: {
    200: {
      type: "object",
      properties: {
        address: { type: "string" },
        key: { type: "string" },
      },
    },
  },
};

export const CreateTransactionSchema = {
  description: "Create a transaction",
  tags: ["Transactions"],
  summary: "Create a transaction",
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
  response: {
    200: {
      type: "object",
      properties: {
        fromAddress: { type: "string" },
        toAddress: { type: "string" },
        amount: { type: "number" },
        fee: { type: "number" },
        timestamp: { type: "number" },
        signature: { type: "string" },
      },
    },
    400: {
      type: "object",
      properties: {
        code: { type: "string" },
        error: { type: "string" },
        message: { type: "string" },
        statusCode: { type: "number" },
      },
    },
  },
};

export const GetPendingTransactionsSchema = {
  description: "Get pending transactions",
  tags: ["Transactions"],
  summary: "Pending transactions",
  response: {
    201: {
      type: "object",
      properties: {
        transactions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              fromAddress: { type: "string" },
              toAddress: { type: "string" },
              amount: { type: "number" },
              fee: { type: "number" },
              timestamp: { type: "number" },
              signature: { type: "string" },
            },
          },
        },
      },
    },
  },
};
