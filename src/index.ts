import { buildWebApi } from "./webapi";
import process from "node:process";

async function main() {
  const server = await buildWebApi();

  try {
    await server.listen({ port: +(process.env.WEBAPI_PORT || 3000) });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
main();
