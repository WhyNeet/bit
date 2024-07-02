import { Module } from "@nestjs/common";
import { CachingServicesModule } from "src/frameworks/caching-services/caching-services.module";
import { DataServicesModule } from "src/frameworks/data-services/data-services.module";
import { RelationFeatureModule } from "../relation/relation-feature.module";
import { UserFactoryService } from "./user-factory.service";
import { UserRepositoryService } from "./user-repository.service";

@Module({
  imports: [DataServicesModule, RelationFeatureModule, CachingServicesModule],
  providers: [UserFactoryService, UserRepositoryService],
  exports: [UserFactoryService, UserRepositoryService],
})
export class UserFeatureModule {}
