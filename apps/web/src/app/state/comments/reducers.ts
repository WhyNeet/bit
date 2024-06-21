import { createReducer, on } from "@ngrx/store";
import { commentCreated, commentsFetched } from "./actions";
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
);
