import { before, describe, it } from "node:test";
import assert from "node:assert";
import { buildWebApi } from "../../webapi";
import { buildWallet, signTransaction } from "../../../lib/core/index";
import { FastifyInstance } from "fastify";

describe("Miners endpoint test", () => {
  let server: FastifyInstance;

  before(async () => {
    server = await buildWebApi();
  });

  it("should mine an empty block", async () => {
    const miner = buildWallet();

    const resMine = await server.inject({
      method: "POST",
      url: "/api/v1/mine",
      payload: {
        minerAddress: miner.address,
        message: "Empty block",
      },
    });

    assert.equal(resMine.statusCode, 200);

    const resBalance = await server.inject({
      method: "GET",
      url: `/api/v1/chain/addresses/${miner.address}`,
    });
    const responseBody = JSON.parse(resBalance.body);
    assert.equal(resBalance.statusCode, 200);
    assert.equal(responseBody.balance, 100);
  });
});
