import { Controller, Get, HttpCode, Param, UseGuards } from "@nestjs/common";
import { UserDto } from "src/core/dtos/user.dto";
import { ApiResponse } from "src/core/types/response/response.interface";
import { UserException } from "src/features/exception-handling/exceptions/user.exception";
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
	public async getCurrentUser(
		@Token() token: JwtPayload,
	): ApiResponse<UserDto> {
		const user = await this.userRepositoryService.getUserById(token.sub);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}

	@HttpCode(200)
	@Get("/:userId")
	public async getUserById(
		@Param("userId") userId: string,
	): ApiResponse<UserDto> {
		const user = await this.userRepositoryService.getUserById(userId);

		if (!user) throw new UserException.UserDoesNotExist();

		return {
			data: this.userFactoryService.createDto(user),
		};
	}
}
