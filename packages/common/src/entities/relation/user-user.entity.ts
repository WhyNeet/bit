import { User } from "../user.entity";

export enum UserUserRelationType {
  Follow = "FOLLOW",
  Block = "BLOCK",
}

export class UserUserRelation {
  fromUser: string | User;
  toUser: string | User;
  type: UserUserRelationType;
}
