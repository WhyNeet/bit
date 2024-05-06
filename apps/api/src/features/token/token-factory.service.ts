import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Token } from "common";

@Injectable()
export class TokenFactoryService {
	private refreshTokenExpiresIn: number;

	constructor(private configService: ConfigService) {
		this.refreshTokenExpiresIn = configService.get<number>(
			"tokens.refreshToken.expiration",
		);
	}

	public createTokenEntity(exp?: number): Token {
		const token = new Token();

		token.expireAt = exp
			? new Date(exp * 1000)
			: new Date(new Date().getTime() + this.refreshTokenExpiresIn * 1000);

		return token;
	}
}
