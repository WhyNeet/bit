import { AppModule } from "src/app.module";
import { ApplicationFactory } from "src/application/application.factory";

async function bootstrap() {
  const app = await ApplicationFactory.create(AppModule);

  await app.listen(
    process.env.PORT ?? 8080,
    process.env.PORT ? "0.0.0.0" : "127.0.0.1",
  );
}
bootstrap();
