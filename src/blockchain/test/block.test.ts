import { before, describe, it } from "node:test";
import assert from "node:assert";
import { buildWebApi } from "../../webapi";
import { FastifyInstance } from "fastify";
import { initBlockchainFixtures } from "./fixtures/blockchain.fixtures";

describe("Blocks endpoint test", () => {
  let server: FastifyInstance;
  const { blockchain, secondBlock, thirdBlock } = initBlockchainFixtures();

  before(async () => {
    server = await buildWebApi({ blockchain });
  });

  it("should get block invalid small height", async () => {
    const resGet = await server.inject({
      method: "GET",
      url: "/api/v1/chain/blocks/-2",
    });

    assert.equal(resGet.statusCode, 200);

    const resGetParsed = JSON.parse(resGet.payload);
    assert.deepStrictEqual(resGetParsed, null);
  });

  it("should get block invalid big height", async () => {
    const resGet = await server.inject({
      method: "GET",
      url: "/api/v1/chain/blocks/100",
    });

    assert.equal(resGet.statusCode, 200);

    const resGetParsed = JSON.parse(resGet.payload);
    assert.deepStrictEqual(resGetParsed, null);
  });

  it("should get block selecting height", async () => {
    const resGet = await server.inject({
      method: "GET",
      url: "/api/v1/chain/blocks/1",
    });

    assert.equal(resGet.statusCode, 200);

    const resGetParsed = JSON.parse(resGet.payload);
    const expectedBlock = {
      ...secondBlock,
      header: {
        ...secondBlock.header,
        nextHash: thirdBlock.header.hash,
      },
    };

    assert.deepStrictEqual(resGetParsed, expectedBlock);
  });

  it.skip("should get last block", async () => {
    const resGet = await server.inject({
      method: "GET",
      url: "/api/v1/chain/blocks/last",
    });

    assert.equal(resGet.statusCode, 200);

    const resGetParsed = JSON.parse(resGet.payload);

    const expectedBlock = {
      ...thirdBlock,
      header: {
        ...thirdBlock.header,
        nextHash: "",
      },
    };

    assert.deepStrictEqual(resGetParsed, expectedBlock);
  });
});
