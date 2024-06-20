import { AppModule } from "src/app.module";
import { ApplicationFactory } from "src/application/application.factory";

async function bootstrap() {
  const app = await ApplicationFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
