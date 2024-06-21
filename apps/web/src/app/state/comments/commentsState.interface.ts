import { CommentDto } from "common";

export interface CommentsState {
  // mapping between post id and batches of comments
  comments: Map<string, CommentDto[][]>;
}
