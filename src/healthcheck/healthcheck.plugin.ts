export default function healthcheckPlugin(fastify, _opts, done) {
  fastify.get("/healthcheck", (_req, _res) => {
    return { status: "ok" };
  });

  done();
}
