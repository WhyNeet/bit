import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenType } from "src/core/entities/token.entity";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";
import { TokenEncryptionService } from "./token-encryption.service";
import { TokenFactoryService } from "./token-factory.service";
import { TokenRepositoryService } from "./token-repository.service";

@Injectable()
export class TokenRefreshMiddlware implements NestMiddleware {
	constructor(
		private tokenEncryptionService: TokenEncryptionService,
		private tokenFactoryService: TokenFactoryService,
		private tokenRepositoryService: TokenRepositoryService,
	) {}

	public async use(
		req: Request,
		res: Response,
		next: (error?: unknown) => void,
	) {
		const refreshToken = req.cookies[TokenType.RefreshToken];
		if (!refreshToken) return next();

		const refreshTokenPayload =
			await this.tokenEncryptionService.decodeRefreshToken(refreshToken);

		if (!refreshTokenPayload) return next();

		const accessToken = req.cookies[TokenType.AccessToken];
		if (!accessToken) {
			await this.refreshAccessToken(req, res, refreshTokenPayload);
			return next();
		}

		const accessTokenPayload =
			await this.tokenEncryptionService.decodeAccessToken(accessToken);

		if (!accessTokenPayload)
			await this.refreshAccessToken(req, res, refreshTokenPayload);

		next();
	}

	private async refreshAccessToken(
		req: Request,
		res: Response,
		payload: JwtPayload,
	) {
		const deletedToken = await this.tokenRepositoryService.deleteToken(
			payload.jti,
		);
		// no token found, user is logged out
		if (!deletedToken) return;

		const tokenEntity = this.tokenFactoryService.createTokenEntity(payload.exp);
		const token = await this.tokenRepositoryService.createToken(tokenEntity);

		const refreshToken = await this.tokenEncryptionService.issueRefreshToken(
			payload.sub,
			token.id,
			payload.exp,
		);
		const accessToken = await this.tokenEncryptionService.issueAccessToken(
			payload.sub,
			token.id,
		);

		req.cookies[TokenType.AccessToken] = accessToken;
		req.cookies[TokenType.RefreshToken] = refreshToken;

		res.cookie(TokenType.AccessToken, accessToken);
		res.cookie(TokenType.RefreshToken, refreshToken);
	}
}
