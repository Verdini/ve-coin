import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import blockchainPlugin from "./blockchain/blockchain.plugin";
import healthcheckPlugin from "./healthcheck/healthcheck.plugin";

type Env = "development" | "production" | "test";

const loggerLevel = {
  development: { level: "debug" },
  production: { level: "info" },
  test: { level: "warn" },
};

export default class WebApi {
  private server;
  private env: Env;

  constructor() {
    this.env = (process.env.NODE_ENV as Env) || "development";

    this.server = fastify({
      logger: loggerLevel[this.env],
    });
  }

  async Init() {
    await this.initSwagger();
    await this.server.register(healthcheckPlugin, { prefix: "/api/v1" });
    await this.server.register(blockchainPlugin, { prefix: "/api/v1" });

    await this.server.ready();
  }

  GetServer() {
    return this.server;
  }

  async Run() {
    try {
      await this.server.listen({ port: 3000 });
    } catch (err) {
      this.server.log.error(err);
      process.exit(1);
    }
  }

  private async initSwagger() {
    if (this.env === "test") return;

    await this.server.register(swagger, {
      openapi: {
        info: {
          title: "Ve Coin API",
          description: "Ve Coin API documentation",
          version: "1.0.0",
        },
      },
    });

    await this.server.register(swaggerUi, {
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
  }
}
