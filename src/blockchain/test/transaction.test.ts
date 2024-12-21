import { before, describe, it } from "node:test";
import assert from "node:assert";
import WebApi from "../../webapi";
import { Wallet } from "../../../lib/core";
import { Transaction } from "../../../lib/core";

describe("Transaction's endpoint test", () => {
  let app;

  before(async () => {
    app = new WebApi();
    await app.Init();
  });

  it("should create a valid transaction", async () => {
    const from = new Wallet();
    const to = new Wallet();

    const transaction = new Transaction({
      fromAddress: from.Address,
      toAddress: to.Address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
    });
    transaction.Sign(from.Key);

    const resPost = await app.GetServer().inject({
      method: "POST",
      url: "/api/v1/transactions",
      payload: transaction.ToJSON(),
    });

    assert.equal(resPost.statusCode, 200);
    const resPostParsed = JSON.parse(resPost.payload);
    assert.deepEqual(resPostParsed, transaction.ToJSON());

    const resGet = await app.GetServer().inject({
      method: "GET",
      url: "/api/v1/transactions",
    });

    assert.equal(resGet.statusCode, 200);

    const resGetParsed = JSON.parse(resGet.payload);
    const pendingTransaction = {
      transactions: [transaction.ToJSON()],
    };
    assert.deepEqual(resGetParsed, pendingTransaction);
  });

  it("should return a bad request", async () => {
    const from = new Wallet();
    const to = new Wallet();

    const transaction = {
      fromAddress: from.Address,
      toAddress: to.Address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
    };

    app.GetServer().inject(
      {
        method: "POST",
        url: "/api/v1/transactions",
        payload: transaction,
      },
      (_err, response) => {
        assert.equal(response?.statusCode, 400);

        const payload = JSON.parse(response.payload);

        assert.deepEqual(payload, {
          statusCode: 400,
          code: "FST_ERR_VALIDATION",
          error: "Bad Request",
          message: "body must have required property 'signature'",
        });
      }
    );
  });
});
