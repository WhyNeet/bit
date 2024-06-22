import { createAction, props } from "@ngrx/store";
import { CommentDto } from "common";

export const commentsFetched = createAction(
  "[Comments] Comments Fetched",
  props<{ postId: string; comments: CommentDto[] }>(),
);
export const commentCreated = createAction(
  "[Comments] Comment Created",
  props<{ postId: string; comment: CommentDto }>(),
);
export const commentUpdated = createAction(
  "[Comments] Comment Updated",
  props<{ postId: string; commentId: string; content: string }>(),
);
