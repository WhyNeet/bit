import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ApiResponse, TokenType, UserDto } from "common";
import { Request, Response } from "express";
import { CreateUserDto, UserCredentialsDto } from "src/core/dtos/user.dto";
import { AuthService } from "src/features/auth/auth.service";
import { AuthException } from "src/features/exception-handling/exceptions/auth.exception";
import { TokenEncryptionService } from "src/features/token/token-encryption.service";
import { TokenFactoryService } from "src/features/token/token-factory.service";
import { TokenRepositoryService } from "src/features/token/token-repository.service";
import { UserFactoryService } from "src/features/user/user-factory.service";
import { UserRepositoryService } from "src/features/user/user-repository.service";

@Controller("/auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private userFactoryService: UserFactoryService,
		private tokenFactoryService: TokenFactoryService,
		private userRepositoryService: UserRepositoryService,
		private tokenRepositoryService: TokenRepositoryService,
		private tokenEncryptionService: TokenEncryptionService,
	) {}

	@HttpCode(200)
	@Post("/register")
	public async register(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true }) response: Response,
	): ApiResponse<UserDto> {
		const user = await this.authService.registerUser(createUserDto);

		const tokenEntity = this.tokenFactoryService.createTokenEntity();
		const token = await this.tokenRepositoryService.createToken(tokenEntity);

		const accessToken = await this.tokenEncryptionService.issueAccessToken(
			user.id,
			token.id,
		);
		const refreshToken = await this.tokenEncryptionService.issueRefreshToken(
			user.id,
			token.id,
		);

		response.cookie(TokenType.AccessToken, accessToken, { httpOnly: true });
		response.cookie(TokenType.RefreshToken, refreshToken, { httpOnly: true });

		return {
			data: this.userFactoryService.createDto(user),
		};
	}

	@HttpCode(200)
	@Post("/login")
	public async login(
		@Body() userCredentialsDto: UserCredentialsDto,
		@Res({ passthrough: true }) response: Response,
	): ApiResponse<UserDto> {
		const user = await this.userRepositoryService.getUserByEmail(
			userCredentialsDto.email,
		);

		if (!user) throw new AuthException.UserDoesNotExist();

		if (!(await bcrypt.compare(userCredentialsDto.password, user.password)))
			throw new AuthException.WrongPassword();

		const tokenEntity = this.tokenFactoryService.createTokenEntity();
		const token = await this.tokenRepositoryService.createToken(tokenEntity);

		const accessToken = await this.tokenEncryptionService.issueAccessToken(
			user.id,
			token.id,
		);
		const refreshToken = await this.tokenEncryptionService.issueRefreshToken(
			user.id,
			token.id,
		);

		response.cookie(TokenType.AccessToken, accessToken, { httpOnly: true });
		response.cookie(TokenType.RefreshToken, refreshToken, { httpOnly: true });

		return {
			data: this.userFactoryService.createDto(user),
		};
	}

	@HttpCode(200)
	@Post("/logout")
	public async logout(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	): ApiResponse<null> {
		const token = await this.tokenEncryptionService.decodeRefreshToken(
			request.cookies[TokenType.RefreshToken],
		);

		await this.tokenRepositoryService.deleteToken(token.jti);

		response.clearCookie(TokenType.AccessToken, { httpOnly: true });
		response.clearCookie(TokenType.RefreshToken, { httpOnly: true });

		return {
			data: null,
		};
	}
}
