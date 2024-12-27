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
      message: { type: "string" },
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
        message: { type: "string" },
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
              message: { type: "string" },
              signature: { type: "string" },
            },
          },
        },
      },
    },
  },
};

export const MineSchema = {
  description: "Mine pending transactions",
  tags: ["Transactions"],
  summary: "Mine transactions",
  response: {
    200: {},
  },
};

export const IsValidChainSchema = {
  description: "Check if the chain is valid",
  tags: ["Chain"],
  summary: "Is the chain valid?",
  response: {
    200: {},
  },
};

export const GetLastBlockSchema = {
  description: "Get the last block",
  tags: ["Chain"],
  summary: "Last block",
  response: {
    200: {
      type: "object",
      properties: {
        index: { type: "number" },
        timestamp: { type: "number" },
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
        nonce: { type: "number" },
        previousHash: { type: "string" },
        hash: { type: "string" },
      },
    },
  },
};

export const GetBlockSchema = {
  description: "Get a specific block",
  tags: ["Chain"],
  summary: "Specific block",
  params: {
    type: "object",
    required: ["block"],
    properties: {
      index: { type: "number" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        index: { type: "number" },
        timestamp: { type: "number" },
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
        nonce: { type: "number" },
        previousHash: { type: "string" },
        hash: { type: "string" },
      },
    },
  },
};

export const GetBalanceSchema = {
  description: "Get the balance of an address",
  tags: ["Chain"],
  summary: "Balance",
  params: {
    type: "object",
    required: ["address"],
    properties: {
      address: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        balance: { type: "number" },
      },
    },
  },
};
