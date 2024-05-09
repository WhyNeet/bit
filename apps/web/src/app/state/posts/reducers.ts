import { createReducer, on } from "@ngrx/store";
import { homePostsFetched, latestPostsFetched } from "./actions";
import { PostsState } from "./postsState.interface";

export const initialState: PostsState = {
	home: null,
	latest: null,
};

export const reducers = createReducer(
	initialState,
	on(homePostsFetched, (state, action) => ({ ...state, home: action.posts })),
	on(latestPostsFetched, (state, action) => ({
		...state,
		latest: action.posts,
	})),
);
