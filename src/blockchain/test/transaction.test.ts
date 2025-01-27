import { before, describe, it } from "node:test";
import assert from "node:assert";
import { buildWebApi } from "../../webapi";
import { signTransaction, Wallet } from "../../../lib/core";
import { FastifyInstance } from "fastify";
import { initBlockchainFixtures } from "./fixtures/blockchain.fixtures";

describe("Transaction's endpoint test", () => {
  let server: FastifyInstance;
  const { blockchain, wallet1, wallet2 } = initBlockchainFixtures();

  before(async () => {
    server = await buildWebApi({ blockchain });
  });

  it("should create a valid transaction", async () => {
    const transaction = {
      fromAddress: wallet1.address,
      toAddress: wallet2.address,
      amount: 30,
      fee: 5,
      timestamp: new Date().getTime(),
      signature: "",
    };
    signTransaction(transaction, wallet1.key);

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
    const transaction = {
      fromAddress: wallet1.address,
      toAddress: wallet2.address,
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
