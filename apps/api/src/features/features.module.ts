import { Module } from "@nestjs/common";
import { AuthFeatureModule } from "./auth/auth-feature.module";
import { CommunityFeatureModule } from "./community/community-feature.module";
import { TokenFeatureModule } from "./token/token-feature.module";
import { UserFeatureModule } from "./user/user-feature.module";

@Module({
	imports: [
		UserFeatureModule,
		AuthFeatureModule,
		TokenFeatureModule,
		CommunityFeatureModule,
	],
	exports: [
		UserFeatureModule,
		AuthFeatureModule,
		TokenFeatureModule,
		CommunityFeatureModule,
	],
})
export class FeaturesModule {}
