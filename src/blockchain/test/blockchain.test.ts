import { before, describe, it } from "node:test";
import assert from "node:assert";
import { buildWebApi } from "../../webapi";
import { buildWallet } from "../../../lib/core";
import { FastifyInstance } from "fastify";
import { initBlockchainFixtures } from "./fixtures/blockchain.fixtures";

describe("Blockchain general endpoint test", () => {
  let server: FastifyInstance;
  const { blockchain } = initBlockchainFixtures();

  before(async () => {
    server = await buildWebApi({ blockchain });
  });

  it("should confirm the blockchain is valid", async () => {
    const res = await server.inject({
      method: "GET",
      url: `/api/v1/chain/valid`,
    });
    const responseBody = JSON.parse(res.payload);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(responseBody, { isValid: true });
  });
});
