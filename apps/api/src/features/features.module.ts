import { Module } from "@nestjs/common";
import { AuthFeatureModule } from "./auth/auth-feature.module";
import { UserFeatureModule } from "./user/user-feature.module";

@Module({
	imports: [UserFeatureModule, AuthFeatureModule],
	exports: [UserFeatureModule, AuthFeatureModule],
})
export class FeaturesModule {}
