import { Module } from "@nestjs/common";
import { CachingServicesModule } from "src/frameworks/caching-services/caching-services.module";
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
    CachingServicesModule,
  ],
  providers: [PostFactoryService, PostRepositoryService],
  exports: [PostFactoryService, PostRepositoryService],
})
export class PostFeatureModule {}
