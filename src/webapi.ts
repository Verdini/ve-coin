import fastify, { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import blockchainPlugin from "./blockchain/blockchain.plugin";
import healthcheckPlugin from "./healthcheck/healthcheck.plugin";
import process from "node:process";
import { Block, Blockchain } from "../lib/core";

type Env = "development" | "production" | "test";

type WebApiOptions = {
  // Inject custom blockchain for testing purposes only
  blockchain?: Blockchain;
};

const loggerLevel = {
  development: { level: "debug" },
  production: { level: "info" },
  test: { level: "warn" },
};

export async function buildWebApi(
  options?: WebApiOptions
): Promise<FastifyInstance> {
  const env = (process.env.NODE_ENV as Env) || "development";
  const server = fastify({
    logger: loggerLevel[env],
    maxParamLength: 130,
  });

  const initSwagger = async () => {
    if (env === "test") return;

    await server.register(swagger, {
      openapi: {
        info: {
          title: "Ve Coin API",
          description: "Ve Coin API documentation",
          version: "1.0.0",
        },
      },
    });

    await server.register(swaggerUi, {
      routePrefix: "/api/docs",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (_req, _res, next) {
          next();
        },
        preHandler: function (_request, _res, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, _req, _res) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });
  };

  await initSwagger();
  await server.register(healthcheckPlugin, { prefix: "/api/v1" });
  await server.register(blockchainPlugin, {
    prefix: "/api/v1",
    blockchain: options?.blockchain,
  });

  await server.ready();

  return server;
}
