import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { CreateUserDto, UserCredentialsDto } from "src/core/dtos/user.dto";
import { AuthService } from "src/features/auth/auth.service";
import { TokenFactoryService } from "src/features/token/token-factory.service";
import { UserFactoryService } from "src/features/user/user-factory.service";
import { UserRepositoryService } from "src/features/user/user-repository.service";

@Controller("/auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private userFactoryService: UserFactoryService,
		private tokenFactoryService: TokenFactoryService,
		private userRepositoryService: UserRepositoryService,
	) {}

	@HttpCode(200)
	@Post("/register")
	public async register(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true }) response: Response,
	) {
		const user = await this.authService.registerUser(createUserDto);

		const accessToken = await this.tokenFactoryService.issueAccessToken(
			user.id,
		);
		const refreshToken = await this.tokenFactoryService.issueRefreshToken(
			user.id,
		);

		response.cookie("access_token", accessToken);
		response.cookie("refresh_token", refreshToken);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}

	@HttpCode(200)
	@Post("/login")
	public async login(
		@Body() userCredentialsDto: UserCredentialsDto,
		@Res({ passthrough: true }) response: Response,
	) {
		const user = await this.userRepositoryService.getUserByEmail(
			userCredentialsDto.email,
		);

		if (!user) {
			throw new BadRequestException("User not found");
		}

		if (!(await bcrypt.compare(userCredentialsDto.password, user.password))) {
			throw new BadRequestException("Invalid password");
		}

		const accessToken = await this.tokenFactoryService.issueAccessToken(
			user.id,
		);
		const refreshToken = await this.tokenFactoryService.issueRefreshToken(
			user.id,
		);

		response.cookie("access_token", accessToken);
		response.cookie("refresh_token", refreshToken);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}
}
