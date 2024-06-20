import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/frameworks/data-services/data-services.module";
import { PostFeatureModule } from "../post/post-feature.module";
import { UserFeatureModule } from "../user/user-feature.module";
import { CommentFactoryService } from "./comment-factory.service";
import { CommentRepositoryService } from "./comment-repository.service";

@Module({
  imports: [DataServicesModule, UserFeatureModule, PostFeatureModule],
  providers: [CommentFactoryService, CommentRepositoryService],
  exports: [CommentFactoryService, CommentRepositoryService],
})
export class CommentFeatureModule {}
