import { Injectable } from "@nestjs/common";
import { UserUserRelation } from "common";
import { UserUserRelationType } from "common";
import {
  UserCommunityRelation,
  UserCommunityRelationType,
  UserPostRelation,
  UserPostRelationType,
} from "common";

@Injectable()
export class RelationFactoryService {
  public createUserCommunityRelation(
    userId: string,
    communityId: string,
    type: UserCommunityRelationType,
  ): UserCommunityRelation {
    const relation = new UserCommunityRelation();

    relation.user = userId;
    relation.community = communityId;
    relation.type = type;

    return relation;
  }

  public createUserPostRelation(
    userId: string,
    postId: string,
    type: UserPostRelationType,
  ): UserPostRelation {
    const relation = new UserPostRelation();

    relation.user = userId;
    relation.post = postId;
    relation.type = type;

    return relation;
  }

  public createUserUserRelation(
    fromUser: string,
    toUser: string,
    type: UserUserRelationType,
  ): UserUserRelation {
    const relation = new UserUserRelation();

    relation.fromUser = fromUser;
    relation.toUser = toUser;
    relation.type = type;

    return relation;
  }
}
