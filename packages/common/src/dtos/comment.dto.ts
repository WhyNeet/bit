import { PostDto } from "./post.dto";
import { UserDto } from "./user.dto";

export class CreateCommentDto {
  content: string;

  post: string;
}

export class UpdateCommentDto {
  content: string;
}

export class CommentDto {
  id: string;

  content: string;

  author: UserDto | string;
  post: PostDto | string;

  createdAt: Date;
  updatedAt: Date;
}
