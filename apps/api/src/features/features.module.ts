import { Module } from "@nestjs/common";
import { UserFeatureModule } from "./user/user-feature.module";

@Module({
	imports: [UserFeatureModule],
	exports: [UserFeatureModule],
})
export class FeaturesModule {}
