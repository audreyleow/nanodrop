import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

process.on("uncaughtException", async (error) => {
  console.error(
    `An uncaught EXCEPTION was detected and passed: ${error.message}`,
    error.stack
  );
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("v1");
  app.enableCors();

  await app.listen(5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
