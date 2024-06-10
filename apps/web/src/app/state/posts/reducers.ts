import { createReducer, on } from "@ngrx/store";
import {
	homePostsFetched,
	latestPostsFetched,
	postCreated,
	postsFetching,
} from "./actions";
import { PostsState } from "./postsState.interface";

export const initialState: PostsState = {
	home: {
		isLoading: false,
		posts: null,
	},
	latest: {
		isLoading: false,
		posts: null,
	},
};

export const reducers = createReducer(
	initialState,
	on(homePostsFetched, (state, action) => ({
		...state,
		home: {
			...state.home,
			isLoading: false,
			posts: [...(state.home.posts ?? []), action.posts],
		},
	})),
	on(latestPostsFetched, (state, action) => ({
		...state,
		latest: {
			...state.latest,
			isLoading: false,
			posts: [...(state.latest.posts ?? []), action.posts],
		},
	})),
	on(postsFetching, (state, action) =>
		action.section === "home"
			? {
					...state,
					home: {
						...state.home,
						isLoading: true,
					},
				}
			: {
					...state,
					latest: {
						...state.latest,
						isLoading: true,
					},
				},
	),
	on(postCreated, (state, action) => ({
		...state,
		home: {
			...state.home,
			posts: [[action.post], ...(state.home.posts ?? [])],
		},
		latest: {
			...state.latest,
			posts: [[action.post], ...(state.latest.posts ?? [])],
		},
	})),
);
