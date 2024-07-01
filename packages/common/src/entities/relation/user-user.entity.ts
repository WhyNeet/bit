import { User } from "../user.entity";

export enum UserUserRelationType {
  Follow = "FOLLOW",
  Block = "BLOCK",
}

export class UserUserRelation {
  user_a: string | User;
  user_b: string | User;
  type: UserUserRelationType;
}
