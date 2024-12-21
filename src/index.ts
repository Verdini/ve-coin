import WebApi from "./webapi";

async function bootstrap() {
  const server = new WebApi();
  await server.Init();
  await server.Run();
}
bootstrap();
