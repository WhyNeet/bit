import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { TokenType } from "common";
import { ExtractJwt, Strategy, WithSecretOrKey } from "passport-jwt";
import { TokenRepositoryService } from "src/features/token/token-repository.service";
import { CookiesExtractorService } from "../extractors/cookies-extractor.service";
import { JwtPayload } from "../jwt/types/payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private configService: ConfigService,
    private cookiesExtractorService: CookiesExtractorService,
    private tokenRepositoryService: TokenRepositoryService,
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
    const token = await this.tokenRepositoryService.getTokenById(payload.jti);
    if (!token) throw new BadRequestException("Revoked token provided.");

    return { sub: payload.sub, jti: payload.jti, exp: payload.exp };
  }
}
