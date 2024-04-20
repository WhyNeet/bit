import { Controller, Get, HttpCode, Param, UseGuards } from "@nestjs/common";
import { UserFactoryService } from "src/features/user/user-factory.service";
import { UserRepositoryService } from "src/features/user/user-repository.service";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/users")
export class UserController {
	constructor(
		private userRepositoryService: UserRepositoryService,
		private userFactoryService: UserFactoryService,
	) {}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get("/me")
	public async getCurrentUser(@Token() token: JwtPayload) {
		const user = await this.userRepositoryService.getUserById(token.sub);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}

	@HttpCode(200)
	@Get("/:userId")
	public async getUserById(@Param("userId") userId: string) {
		const user = await this.userRepositoryService.getUserById(userId);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}
}
