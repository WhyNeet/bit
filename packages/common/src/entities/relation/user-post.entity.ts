import { Post } from "../post.entity";
import { User } from "../user.entity";

export enum UserPostRelationType {
  Upvote = "UPVOTE",
  Downvote = "DOWNVOTE",
}

export class UserPostRelation {
  user: string | User;
  post: string | Post;
  type: UserPostRelationType;
}
