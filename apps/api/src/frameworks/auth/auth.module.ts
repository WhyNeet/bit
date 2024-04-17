import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { FeaturesModule } from "src/features/features.module";
import { CookiesExtractorService } from "./extractors/cookies-extractor.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
	imports: [PassportModule, FeaturesModule],
	providers: [JwtStrategy, CookiesExtractorService],
})
export class AuthModule {}
