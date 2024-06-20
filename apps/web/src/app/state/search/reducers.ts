import { createReducer, on } from "@ngrx/store";
import { searchFinished, searchLoading } from "./actions";
import { SearchState } from "./searchState.interface";

export const initialState: SearchState = {
  isLoading: false,
  searchResults: null,
};

export const reducers = createReducer(
  initialState,
  on(searchLoading, (state) => ({ ...state, isLoading: true })),
  on(searchFinished, (state, action) => ({
    ...state,
    isLoading: false,
    searchResults: action.posts,
  })),
);
