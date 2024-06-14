import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SearchState } from "./searchState.interface";

export const selectFeature = createFeatureSelector<SearchState>("search");
export const selectIsSearchLoading = createSelector(
	selectFeature,
	(state) => state.isLoading,
);
export const selectSearchPosts = createSelector(
	selectFeature,
	(state) => state.searchResults,
);
