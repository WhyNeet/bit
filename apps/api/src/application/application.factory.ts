import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { ValidationExceptionFactory } from "src/features/exception-handling/validation/validation-exception.factory";

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
				exceptionFactory: ValidationExceptionFactory.transform,
			}),
		);

		app.use(cookieParser());

		return app;
	}
}
