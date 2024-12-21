import { HealthcheckSchema } from "./healthcheck.schema";

export default function healthcheckPlugin(fastify, _opts, done) {
  fastify.get("/healthcheck", { schema: HealthcheckSchema }, (_req, _res) => {
    return { status: "ok" };
  });

  done();
}
