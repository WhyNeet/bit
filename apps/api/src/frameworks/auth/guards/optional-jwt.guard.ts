import { ExecutionContext } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt.guard";

export class OptionalJwtAuthGuard extends JwtAuthGuard {
	handleRequest<TUser = unknown>(
		err: unknown,
		user: TUser,
		info: unknown,
		context: ExecutionContext,
		status?: unknown,
	): TUser {
		return user;
	}
}
