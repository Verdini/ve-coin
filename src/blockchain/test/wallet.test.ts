import { before, describe, it } from "node:test";
import assert from "node:assert";
import WebApi from "../../webapi";

describe("Wallet's endpoint test", () => {
  let app;

  before(async () => {
    app = new WebApi();
    await app.Init();
  });

  it("should create a valid Wallet", async () => {
    app.GetServer().inject(
      {
        method: "POST",
        url: "/api/v1/wallets",
      },
      (_err, response) => {
        assert.equal(response?.statusCode, 200);

        const payload = JSON.parse(response.payload);

        assert(payload.address, "Address is missing in the response payload");
        assert(payload.key, "Key is missing in the response payload");

        assert.equal(payload.address.length, 130, "Invalid address length");
        assert.equal(payload.key.length, 64, "Invalid key length");
      }
    );
  });
});
