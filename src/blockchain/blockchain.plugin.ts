import { FastifyInstance, FastifyRequest } from "fastify";
import { BlockchainService } from "./blockchain.service";
import {
  CreateTransactionSchema,
  CreateWalletSchema,
  GetPendingTransactionsSchema,
} from "./blockchain.schema";
import { TransactionDTO } from "./blockchain.dto";

export default function blockchainPlugin(
  fastify: FastifyInstance,
  _opts,
  done
) {
  const blockchainService = new BlockchainService();

  fastify.post(
    "/wallets",
    {
      schema: CreateWalletSchema,
    },
    (_req, _res) => {
      return blockchainService.createWallet();
    }
  );

  fastify.post(
    "/transactions",
    {
      schema: CreateTransactionSchema,
    },
    (req: FastifyRequest<{ Body: TransactionDTO }>, _res) => {
      return blockchainService.createTransaction(req.body);
    }
  );

  fastify.get(
    "/transactions",
    { schema: GetPendingTransactionsSchema },
    (req, res) => {
      return blockchainService.getPendingTransactions();
    }
  );

  // Mine pending transactions
  fastify.post("/mine", (req, res) => {
    return {};
  });

  // Audit the blockchain
  fastify.get("/chain/valid", (req, res) => {
    return {};
  });

  //Get the last block
  fastify.get("/chain/blocks/last", (req, res) => {
    return {};
  });

  // Get a specific block
  fastify.get("/chain/blocks/:block", (req, res) => {
    return {};
  });

  // Get the balance of an address
  fastify.get("/chain/addresses/:address", (req, res) => {
    return {};
  });

  done();
}
