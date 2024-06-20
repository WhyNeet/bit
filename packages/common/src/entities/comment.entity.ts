import { Post } from "./post.entity";
import { User } from "./user.entity";

export class Comment {
  id: string;

  content: string;

  author: User | string;
  post: Post | string;

  createdAt: Date;
  updatedAt: Date;
}
