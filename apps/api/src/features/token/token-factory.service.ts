import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenType } from "src/core/entities/token.entity";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Injectable()
export class TokenFactoryService {
	private accessTokenExpiresIn: number;
	private refreshTokenExpiresIn: number;

	private accessTokenSecret: string;
	private refreshTokenSecret: string;

	constructor(
		private configService: ConfigService,
		private jwtService: JwtService,
	) {
		this.refreshTokenExpiresIn = configService.get<number>(
			"tokens.refreshToken.expiration",
		);
		this.accessTokenExpiresIn = configService.get<number>(
			"tokens.accessToken.expiration",
		);
		this.accessTokenSecret = configService.get<string>(
			"tokens.accessToken.secret",
		);
		this.refreshTokenSecret = configService.get<string>(
			"tokens.refreshToken.secret",
		);
	}

	public async issueAccessToken(userId: string): Promise<string> {
		const payload: JwtPayload = {
			sub: userId,
		};

		const token = await this.jwtService.signAsync(payload, {
			expiresIn: this.accessTokenExpiresIn,
			secret: this.accessTokenSecret,
		});

		return token;
	}

	public async issueRefreshToken(userId: string): Promise<string> {
		const payload: JwtPayload = {
			sub: userId,
		};

		const token = await this.jwtService.signAsync(payload, {
			expiresIn: this.refreshTokenExpiresIn,
			secret: this.refreshTokenSecret,
		});

		return token;
	}
}
