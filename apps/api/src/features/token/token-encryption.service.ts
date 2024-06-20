import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  JwtCreatePayload,
  JwtPayload,
} from "src/frameworks/auth/jwt/types/payload.interface";

@Injectable()
export class TokenEncryptionService {
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

  public async issueAccessToken(userId: string, jti: string): Promise<string> {
    const payload: JwtCreatePayload = {
      sub: userId,
      jti,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenExpiresIn,
      secret: this.accessTokenSecret,
    });

    return token;
  }

  public async issueRefreshToken(
    userId: string,
    jti: string,
    exp?: number,
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      jti,
      exp: Number(
        exp ??
          (new Date().getTime() / 1000 + this.refreshTokenExpiresIn).toFixed(0),
      ),
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.refreshTokenSecret,
    });

    return token;
  }

  public async decodeRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.refreshTokenSecret,
      });
    } catch (_) {
      return null;
    }
  }

  public async decodeAccessToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.accessTokenSecret,
      });
    } catch (_) {
      return null;
    }
  }
}
