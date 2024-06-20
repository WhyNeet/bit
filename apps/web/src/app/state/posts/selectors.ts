import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PostsState } from "./postsState.interface";

export const selectFeature = createFeatureSelector<PostsState>("posts");
export const selectHomePosts = createSelector(
  selectFeature,
  (state) => state.home,
);

export const selectLatestPosts = createSelector(
  selectFeature,
  (state) => state.latest,
);
