import { Module } from "@nestjs/common";
import { CommunityFeatureModule } from "../community/community-feature.module";
import { UserFeatureModule } from "../user/user-feature.module";
import { VectorFactoryService } from "./vector-factory.service";

@Module({
  imports: [UserFeatureModule, CommunityFeatureModule],
  providers: [VectorFactoryService],
  exports: [VectorFactoryService],
})
export class VectorFeatureModule {}
