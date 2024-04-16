import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenFactoryService } from "./token-factory.service";

@Module({
	imports: [JwtModule.register({ signOptions: { algorithm: "HS256" } })],
	providers: [TokenFactoryService],
	exports: [TokenFactoryService, JwtModule],
})
export class TokenFeatureModule {}
