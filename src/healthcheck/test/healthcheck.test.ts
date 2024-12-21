import { before, describe, it } from "node:test";
import assert from "node:assert";
import WebApi from "../../webapi";

describe("Healthcheck endpoint test", () => {
  let app;

  before(async () => {
    app = new WebApi();
    await app.Init();
  });

  it("should return status ok", async () => {
    app.GetServer().inject(
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
