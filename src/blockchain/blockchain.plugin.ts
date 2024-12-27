import { FastifyInstance, FastifyRequest } from "fastify";
import { BlockchainService } from "./blockchain.service";
import {
  CreateTransactionSchema,
  CreateWalletSchema,
  GetBalanceSchema,
  GetBlockSchema,
  GetLastBlockSchema,
  GetPendingTransactionsSchema,
  IsValidChainSchema,
  MineSchema,
} from "./blockchain.schema";
import { TransactionDTO } from "./blockchain.dto";
import { BlockchainRepositoryMemory } from "./blockchain.repository";

export default function blockchainPlugin(
  fastify: FastifyInstance,
  _opts,
  done
) {
  const blockchainRepo = new BlockchainRepositoryMemory();
  const blockchainService = new BlockchainService(blockchainRepo);

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
    async (req: FastifyRequest<{ Body: TransactionDTO }>, _res) => {
      return await blockchainService.createTransaction(req.body);
    }
  );

  fastify.get(
    "/transactions",
    { schema: GetPendingTransactionsSchema },
    async (_req, _res) => {
      return await blockchainService.getPendingTransactions();
    }
  );

  fastify.post("/mine", { schema: MineSchema }, async (_req, _res) => {
    return await blockchainService.mine();
  });

  fastify.get(
    "/chain/valid",
    { schema: IsValidChainSchema },
    async (_req, _res) => {
      return await blockchainService.isValidChain();
    }
  );

  fastify.get(
    "/chain/blocks/last",
    { schema: GetLastBlockSchema },
    async (req, res) => {
      return await blockchainService.getLastBlock();
    }
  );

  fastify.get(
    "/chain/blocks/:block",
    { schema: GetBlockSchema },
    async (
      req: FastifyRequest<{
        Params: { index: number };
      }>,
      _res
    ) => {
      return await blockchainService.getBlock(req.params.index);
    }
  );

  fastify.get(
    "/chain/addresses/:address",
    { schema: GetBalanceSchema },
    async (
      req: FastifyRequest<{
        Params: { address: string };
      }>,
      _res
    ) => {
      return await blockchainService.getBalance(req.params.address);
    }
  );

  done();
}
