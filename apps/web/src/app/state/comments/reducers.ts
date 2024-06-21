import { createReducer, on } from "@ngrx/store";
import { commentCreated, commentsFetched } from "./actions";
import { CommentsState } from "./commentsState.interface";

export const initialState: CommentsState = {
  comments: new Map(),
};

export const reducers = createReducer(
  initialState,
  on(commentsFetched, (state, action) => {
    state.comments.set(action.postId, action.comments);
    return state;
  }),
  on(commentCreated, (state, action) => {
    state.comments.set(action.postId, [
      action.comment,
      ...(state.comments.get(action.postId) ?? []),
    ]);
    return state;
  }),
);
