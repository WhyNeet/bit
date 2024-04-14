import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";

// biome-ignore lint/complexity/noStaticOnlyClass: static factory class
export class ApplicationFactory {
	public static async create<M extends { new (...args: unknown[]): object }>(
		module: M,
	): Promise<INestApplication<M>> {
		const app: INestApplication = await NestFactory.create(module);

		app.setGlobalPrefix("/api");

		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
			}),
		);

		app.use(cookieParser());

		return app;
	}
}
