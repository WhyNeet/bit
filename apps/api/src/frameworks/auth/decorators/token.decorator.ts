import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Token = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return request.user;
  },
);
