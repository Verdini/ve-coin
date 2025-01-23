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

  it("mine an empty block", async () => {
    const miner = buildWallet();

    const res = await server.inject({
      method: "POST",
      url: "/api/v1/mine",
      payload: {
        minerAddress: miner.address,
        message: "Empty block",
      },
    });

    assert.equal(res.statusCode, 200);
  });
});
