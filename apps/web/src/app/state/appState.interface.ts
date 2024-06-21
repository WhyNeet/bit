import { Action, ActionReducer } from "@ngrx/store";
import { CommentsState } from "./comments/commentsState.interface";
import { PostsState } from "./posts/postsState.interface";
import { SearchState } from "./search/searchState.interface";
import { UserState } from "./user/userState.interface";

export interface AppState {
  user: UserState;
  posts: PostsState;
  search: SearchState;
  comments: CommentsState;
}

export type AppReducers = {
  [key in keyof AppState]: ActionReducer<AppState[key], Action>;
};
