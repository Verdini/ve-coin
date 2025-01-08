import { buildWebApi } from "./webapi";

const server = await buildWebApi();

try {
  await server.listen({ port: 3000 });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
