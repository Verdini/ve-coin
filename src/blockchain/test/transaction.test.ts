import { before, describe, it } from "node:test";
import assert from "node:assert";
import { buildWebApi } from "../../webapi.ts";
import { buildWallet, signTransaction } from "../../../lib/core/index.ts";
import { FastifyInstance } from "fastify";

describe("Transaction's endpoint test", () => {
  let server: FastifyInstance;

  before(async () => {
    server = await buildWebApi();
  });

  it("should create a valid transaction", async () => {
    const from = buildWallet();
    const to = buildWallet();

    const transaction = {
      fromAddress: from.address,
      toAddress: to.address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
      signature: "",
    };
    signTransaction(transaction, from.key);

    const resPost = await server.inject({
      method: "POST",
      url: "/api/v1/transactions",
      payload: transaction,
    });

    assert.equal(resPost.statusCode, 200);
    const resPostParsed = JSON.parse(resPost.payload);
    assert.deepEqual(resPostParsed, transaction);

    const resGet = await server.inject({
      method: "GET",
      url: "/api/v1/transactions",
    });

    assert.equal(resGet.statusCode, 200);

    const resGetParsed = JSON.parse(resGet.payload);
    const pendingTransaction = {
      transactions: [transaction],
    };
    assert.deepEqual(resGetParsed, pendingTransaction);
  });

  it("should return a bad request", async () => {
    const from = buildWallet();
    const to = buildWallet();

    const transaction = {
      fromAddress: from.address,
      toAddress: to.address,
      amount: 100,
      fee: 10,
      timestamp: new Date().getTime(),
    };

    await server.inject(
      {
        method: "POST",
        url: "/api/v1/transactions",
        payload: transaction,
      },
      (_err, response) => {
        assert.equal(response?.statusCode, 400);

        const payload = JSON.parse(response?.payload || "");

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
