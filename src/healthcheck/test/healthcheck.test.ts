import { before, describe, it } from "node:test";
import assert from "node:assert";
import { buildWebApi } from "../../webapi";

describe("Healthcheck endpoint test", () => {
  let server;

  before(async () => {
    server = await buildWebApi();
  });

  it("should return status ok", async () => {
    server.inject(
      {
        method: "GET",
        url: "/api/v1/healthcheck",
      },
      (_err, response) => {
        assert.equal(response?.statusCode, 200);
        assert.equal(response?.payload, JSON.stringify({ status: "ok" }));
      }
    );
  });
});
