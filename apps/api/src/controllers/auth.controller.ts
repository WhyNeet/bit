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
import { Request, Response } from "express";
import { CreateUserDto, UserCredentialsDto } from "src/core/dtos/user.dto";
import { TokenType } from "src/core/entities/token.entity";
import { AuthService } from "src/features/auth/auth.service";
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
	) {
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

		response.cookie(TokenType.AccessToken, accessToken);
		response.cookie(TokenType.RefreshToken, refreshToken);

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

		response.cookie(TokenType.AccessToken, accessToken);
		response.cookie(TokenType.RefreshToken, refreshToken);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}

	@HttpCode(200)
	@Post("/logout")
	public async logout(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const token = await this.tokenEncryptionService.decodeRefreshToken(
			request.cookies[TokenType.RefreshToken],
		);

		await this.tokenRepositoryService.deleteToken(token.jti);

		response.clearCookie(TokenType.AccessToken);
		response.clearCookie(TokenType.RefreshToken);
	}
}
