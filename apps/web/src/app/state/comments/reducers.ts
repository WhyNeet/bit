import { createReducer, on } from "@ngrx/store";
import { commentCreated, commentUpdated, commentsFetched } from "./actions";
import { CommentsState } from "./commentsState.interface";

export const initialState: CommentsState = {
  comments: new Map(),
};

export const reducers = createReducer(
  initialState,
  on(commentsFetched, (state, action) => {
    const updated = new Map(state.comments);

    updated.set(action.postId, [
      ...(state.comments.get(action.postId) ?? []),
      action.comments,
    ]);

    return { comments: updated };
  }),
  on(commentCreated, (state, action) => {
    const updated = new Map(state.comments);

    updated.set(action.postId, [
      [action.comment],
      ...(state.comments.get(action.postId) ?? []),
    ]);
    return { comments: updated };
  }),
  on(commentUpdated, (state, action) => {
    const updated = new Map(state.comments);

    const comments = updated.get(action.postId) ?? [];
    updated.set(
      action.postId,
      comments.map((batch) =>
        batch.map((comment) =>
          comment.id === action.commentId
            ? { ...comment, content: action.content }
            : comment,
        ),
      ),
    );

    return { comments: updated };
  }),
);
