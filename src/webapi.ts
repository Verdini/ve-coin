import fastify from "fastify";
import blockchainPlugin from "./blockchain/blockchain.plugin";
import healthcheckPlugin from "./healthcheck/healthcheck.plugin";

export default class WebApi {
  private server;

  constructor() {
    const loggerLevel = {
      development: { level: "debug" },
      production: { level: "info" },
      test: { level: "warn" },
    };

    this.server = fastify({
      logger: loggerLevel[process.env.NODE_ENV || "development"],
    });
  }

  Init() {
    this.server.register(healthcheckPlugin, { prefix: "/api/v1" });
    this.server.register(blockchainPlugin, { prefix: "/api/v1" });
  }

  GetServer() {
    return this.server;
  }

  async start() {
    try {
      await this.server.listen({ port: 3000 });
    } catch (err) {
      this.server.log.error(err);
      process.exit(1);
    }
  }
}
