import { before, describe, it } from "node:test";
import assert from "node:assert";
import { buildWebApi } from "../../webapi";
import { buildWallet, signTransaction } from "../../../lib/core/index";
import { FastifyInstance } from "fastify";

describe("Blockchain balance endpoint test", () => {
  let server: FastifyInstance;

  before(async () => {
    server = await buildWebApi();
  });

  it("should return the address balance", async () => {
    const wallet = buildWallet();

    const res = await server.inject({
      method: "GET",
      url: `/api/v1/chain/addresses/${wallet.address}`,
    });
    const responseBody = JSON.parse(res.payload);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(responseBody, { address: wallet.address, balance: 0 });
  });
});
