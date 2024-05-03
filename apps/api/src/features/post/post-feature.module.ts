import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/frameworks/data-services/data-services.module";
import { CommunityFeatureModule } from "../community/community-feature.module";
import { RelationFeatureModule } from "../relation/relation-feature.module";
import { UserFeatureModule } from "../user/user-feature.module";
import { PostFactoryService } from "./post-factory.service";
import { PostRepositoryService } from "./post-repository.service";

@Module({
	imports: [
		DataServicesModule,
		UserFeatureModule,
		CommunityFeatureModule,
		RelationFeatureModule,
	],
	providers: [PostFactoryService, PostRepositoryService],
	exports: [PostFactoryService, PostRepositoryService],
})
export class PostFeatureModule {}
