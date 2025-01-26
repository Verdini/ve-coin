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
import { MineDTO, TransactionDTO } from "./blockchain.dto";
import { Blockchain, buildBlockchain, DefaultConsensus } from "../../lib/core";

type BlockchainPluginOptions = {
  blockchain?: Blockchain;
};

export default function blockchainPlugin(
  fastify: FastifyInstance,
  options: BlockchainPluginOptions,
  done: () => void
) {
  const blockchain = options.blockchain || buildBlockchain();

  const blockchainService = new BlockchainService(blockchain);

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
    (_req, _res) => {
      return blockchainService.getPendingTransactions();
    }
  );

  fastify.post(
    "/mine",
    { schema: MineSchema },
    (req: FastifyRequest<{ Body: MineDTO }>, _res) => {
      return blockchainService.mine(req.body);
    }
  );

  fastify.get("/chain/valid", { schema: IsValidChainSchema }, (_req, _res) => {
    return blockchainService.isValidChain();
  });

  fastify.get("/chain/blocks/last", { schema: GetLastBlockSchema }, () => {
    return blockchainService.getLastBlock();
  });

  fastify.get(
    "/chain/blocks/:block",
    { schema: GetBlockSchema },
    (
      req: FastifyRequest<{
        Params: { index: number };
      }>,
      _res
    ) => {
      return blockchainService.getBlock(req.params.index);
    }
  );

  fastify.get(
    "/chain/addresses/:address",
    { schema: GetBalanceSchema },
    (
      req: FastifyRequest<{
        Params: { address: string };
      }>,
      _res
    ) => {
      return blockchainService.getBalance(req.params.address);
    }
  );

  done();
}
