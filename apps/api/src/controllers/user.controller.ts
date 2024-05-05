import { Controller, Get, HttpCode, Param, UseGuards } from "@nestjs/common";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { UserDto } from "src/core/dtos/user.dto";
import { User } from "src/core/entities/user.entity";
import { ApiResponse } from "src/core/types/response/response.interface";
import { UserException } from "src/features/exception-handling/exceptions/user.exception";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
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
		private cachingServices: ICachingServices,
	) {}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get("/me")
	public async getCurrentUser(
		@Token() token: JwtPayload,
	): ApiResponse<UserDto> {
		const cachedUser = await this.cachingServices.get<User>(
			`user:${token.sub}`,
			true,
		);

		if (cachedUser)
			return {
				data: this.userFactoryService.createDto(cachedUser),
			};

		const user = await this.userRepositoryService.getUserById(token.sub);

		await this.cachingServices.set(`user:${token.sub}`, user);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}

	@HttpCode(200)
	@Get("/:userId")
	public async getUserById(
		@Param("userId", ParseObjectIdPipe.stringified()) userId: string,
	): ApiResponse<UserDto> {
		const cachedUser = await this.cachingServices.get<User>(
			`user:${userId}`,
			true,
		);

		if (cachedUser)
			return {
				data: this.userFactoryService.createDto(cachedUser),
			};

		const user = await this.userRepositoryService.getUserById(userId);

		if (!user) throw new UserException.UserDoesNotExist();

		await this.cachingServices.set(`user:${userId}`, user);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}
}
