import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const IncludeFields = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request>();
		const includeFields: string | undefined = request.query.include as string;

		if (!includeFields) return [];

		return includeFields.split(",");
	},
);
