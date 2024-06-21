import { CommentDto } from "common";

export interface CommentsState {
  comments: Map<string, CommentDto[]>;
}
