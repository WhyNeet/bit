import { Module } from "@nestjs/common";
import { AuthFeatureModule } from "./auth/auth-feature.module";
import { CommunityFeatureModule } from "./community/community-feature.module";
import { PostFeatureModule } from "./post/post-feature.module";
import { TokenFeatureModule } from "./token/token-feature.module";
import { UserFeatureModule } from "./user/user-feature.module";

@Module({
	imports: [
		UserFeatureModule,
		AuthFeatureModule,
		TokenFeatureModule,
		CommunityFeatureModule,
		PostFeatureModule,
	],
	exports: [
		UserFeatureModule,
		AuthFeatureModule,
		TokenFeatureModule,
		CommunityFeatureModule,
		PostFeatureModule,
	],
})
export class FeaturesModule {}
