import { Module } from "@nestjs/common";
import { AuthFeatureModule } from "./auth/auth-feature.module";
import { CommentFeatureModule } from "./comment/comment-feature.module";
import { CommunityFeatureModule } from "./community/community-feature.module";
import { PostFeatureModule } from "./post/post-feature.module";
import { RelationFeatureModule } from "./relation/relation-feature.module";
import { TokenFeatureModule } from "./token/token-feature.module";
import { UserFeatureModule } from "./user/user-feature.module";
import { VectorFeatureModule } from "./vector/vector-feature.module";

@Module({
  imports: [
    UserFeatureModule,
    AuthFeatureModule,
    TokenFeatureModule,
    CommunityFeatureModule,
    PostFeatureModule,
    RelationFeatureModule,
    VectorFeatureModule,
    CommentFeatureModule,
  ],
  exports: [
    UserFeatureModule,
    AuthFeatureModule,
    TokenFeatureModule,
    CommunityFeatureModule,
    PostFeatureModule,
    RelationFeatureModule,
    VectorFeatureModule,
    CommentFeatureModule,
  ],
})
export class FeaturesModule {}
