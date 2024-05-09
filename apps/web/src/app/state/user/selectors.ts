import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./userState.interface";

export const selectFeature = createFeatureSelector<UserState>("user");
export const selectUser = createSelector(selectFeature, (user) => user.user);
export const selectIsUserLoading = createSelector(
	selectFeature,
	(user) => user.isLoading,
);
