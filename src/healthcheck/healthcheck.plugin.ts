import { FastifyInstance } from "fastify";
import { HealthcheckSchema } from "./healthcheck.schema";

export default function healthcheckPlugin(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void
) {
  fastify.get("/healthcheck", { schema: HealthcheckSchema }, (_req, _res) => {
    return { status: "ok" };
  });

  done();
}
