import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, WithSecretOrKey } from "passport-jwt";
import { TokenType } from "src/core/entities/token.entity";
import { CookiesExtractorService } from "../extractors/cookies-extractor.service";
import { JwtPayload } from "../jwt/types/payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		private configService: ConfigService,
		private cookiesExtractorService: CookiesExtractorService,
	) {
		const options: WithSecretOrKey = {
			jwtFromRequest: ExtractJwt.fromExtractors([
				cookiesExtractorService.tokenExtractor(TokenType.AccessToken),
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>("tokens.accessToken.secret"),
		};

		super(options);
	}

	public async validate(payload: JwtPayload): Promise<JwtPayload> {
		return { sub: payload.sub, jti: payload.jti, exp: payload.exp };
	}
}
