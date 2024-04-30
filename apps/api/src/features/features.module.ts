import { Module } from "@nestjs/common";
import { AuthFeatureModule } from "./auth/auth-feature.module";
import { CommunityFeatureModule } from "./community/community-feature.module";
import { PostFeatureModule } from "./post/post-feature.module";
import { RelationFeatureModule } from "./relation/relation-feature.module";
import { TokenFeatureModule } from "./token/token-feature.module";
import { UserFeatureModule } from "./user/user-feature.module";

@Module({
	imports: [
		UserFeatureModule,
		AuthFeatureModule,
		TokenFeatureModule,
		CommunityFeatureModule,
		PostFeatureModule,
		RelationFeatureModule,
	],
	exports: [
		UserFeatureModule,
		AuthFeatureModule,
		TokenFeatureModule,
		CommunityFeatureModule,
		PostFeatureModule,
		RelationFeatureModule,
	],
})
export class FeaturesModule {}
