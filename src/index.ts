import WebApi from "./webapi";

async function bootstrap() {
  const server = new WebApi();
  server.Init();
  server.start();
}
bootstrap();
