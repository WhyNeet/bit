import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Token } from "src/core/entities/token.entity";

@Injectable()
export class TokenFactoryService {
	private refreshTokenExpiresIn: number;

	constructor(private configService: ConfigService) {
		this.refreshTokenExpiresIn = configService.get<number>(
			"tokens.refreshToken.expiration",
		);
	}

	public createTokenEntity(): Token {
		const token = new Token();

		token.expireAt = new Date(
			new Date().getTime() + this.refreshTokenExpiresIn * 1000,
		);

		return token;
	}
}
