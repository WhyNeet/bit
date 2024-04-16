import { Injectable } from "@nestjs/common";
import type { Request } from "express";
import { TokenType } from "src/core/entities/token.entity";

@Injectable()
export class CookiesExtractorService {
	public extractToken(req: Request, tokenType: TokenType): string | null {
		if (!req.cookies) return null;
		return req.cookies[tokenType];
	}

	public tokenExtractor(tokenType: TokenType): (req: Request) => string | null {
		return (req: Request) => this.extractToken(req, tokenType);
	}
}
