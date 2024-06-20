import { Action, ActionReducer } from "@ngrx/store";
import { PostsState } from "./posts/postsState.interface";
import { SearchState } from "./search/searchState.interface";
import { UserState } from "./user/userState.interface";

export interface AppState {
  user: UserState;
  posts: PostsState;
  search: SearchState;
}

export type AppReducers = {
  [key in keyof AppState]: ActionReducer<AppState[key], Action>;
};
