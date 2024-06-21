import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CommentsState } from "./commentsState.interface";

export const selectFeature = createFeatureSelector<CommentsState>("comments");
export const selectComments = createSelector(
  selectFeature,
  ({ comments }) => comments,
);
