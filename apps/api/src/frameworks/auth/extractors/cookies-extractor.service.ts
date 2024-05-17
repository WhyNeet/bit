import { Injectable } from "@nestjs/common";
import { TokenType } from "common";
import type { Request } from "express";

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
