import { FastifyInstance, FastifyRequest } from "fastify";
import { BlockchainService } from "./blockchain.service";
import { CreateTransactionSchema } from "./blockchain.schema";
import { TransactionDTO } from "./blockchain.dto";

export default function blockchainPlugin(
  fastify: FastifyInstance,
  _opts,
  done
) {
  const blockchainService = new BlockchainService();

  // Create a wallet
  fastify.post("/wallets", (_req, _res) => {
    return blockchainService.createWallet();
  });

  // Create a transaction
  fastify.post(
    "/transactions",
    {
      schema: CreateTransactionSchema,
    },
    (req: FastifyRequest<{ Body: TransactionDTO }>, _res) => {
      return blockchainService.createTransaction(req.body);
    }
  );

  // View pending transactions
  fastify.get("/transactions", (req, res) => {
    return blockchainService.getPendingTransactions();
  });

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
