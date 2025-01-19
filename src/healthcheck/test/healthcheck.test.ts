import { before, describe, it } from "node:test";
import assert from "node:assert";
import { buildWebApi } from "../../webapi.ts";
import { FastifyInstance } from "fastify";

describe("Healthcheck endpoint test", () => {
  let server: FastifyInstance;

  before(async () => {
    server = await buildWebApi();
  });

  it("should return status ok", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/v1/healthcheck",
    });

    assert.equal(response?.statusCode, 200);
    assert.equal(response?.payload, JSON.stringify({ status: "ok" }));
  });
});
