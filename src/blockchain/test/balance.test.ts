import { before, describe, it } from "node:test";
import assert from "node:assert";
import { buildWebApi } from "../../webapi";
import { buildWallet } from "../../../lib/core";
import { FastifyInstance } from "fastify";
import { initBlockchainFixtures } from "./fixtures/blockchain.fixtures";

describe("Blockchain balance endpoint test", () => {
  let server: FastifyInstance;
  const { blockchain, walletMiner, wallet1, wallet2 } =
    initBlockchainFixtures();

  before(async () => {
    server = await buildWebApi({ blockchain });
  });

  it("should return the address balance", async () => {
    const wallets = [walletMiner, wallet1, wallet2, buildWallet()];

    const promises = wallets.map(async (wallet) => {
      const res = await server.inject({
        method: "GET",
        url: `/api/v1/chain/addresses/${wallet.address}`,
      });

      return JSON.parse(res.payload);
    });
    const results = await Promise.all(promises);

    const expectedResults = [
      { address: walletMiner.address, balance: 110 },
      { address: wallet1.address, balance: 45 },
      { address: wallet2.address, balance: 45 },
      { address: wallets[3].address, balance: 0 },
    ];

    assert.deepStrictEqual(results, expectedResults);
  });
});
