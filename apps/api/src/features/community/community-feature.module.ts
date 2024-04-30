import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/frameworks/data-services/data-services.module";
import { RelationFeatureModule } from "../relation/relation-feature.module";
import { UserFeatureModule } from "../user/user-feature.module";
import { CommunityFactoryService } from "./community-factory.service";
import { CommunityRepositoryService } from "./community-repository.service";

@Module({
	imports: [DataServicesModule, UserFeatureModule, RelationFeatureModule],
	providers: [CommunityFactoryService, CommunityRepositoryService],
	exports: [CommunityFactoryService, CommunityRepositoryService],
})
export class CommunityFeatureModule {}
