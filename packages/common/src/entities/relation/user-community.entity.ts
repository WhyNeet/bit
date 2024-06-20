import { Community } from "../community.entity";
import { User } from "../user.entity";

export enum UserCommunityRelationType {
  Member = "MEMBER",
}

export class UserCommunityRelation {
  user: string | User;
  community: string | Community;
  type: UserCommunityRelationType;
}
