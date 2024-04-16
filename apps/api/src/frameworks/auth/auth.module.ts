import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { CookiesExtractorService } from "./extractors/cookies-extractor.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
	imports: [PassportModule],
	providers: [JwtStrategy, CookiesExtractorService],
})
export class AuthModule {}
