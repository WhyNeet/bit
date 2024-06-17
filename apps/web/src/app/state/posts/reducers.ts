import { createReducer, on } from "@ngrx/store";
import {
	homePostsFetched,
	latestPostsFetched,
	postCreated,
	postDisliked,
	postLiked,
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
	on(postLiked, (state, action) => {
		const homePosts = state.home.posts?.map((batch) =>
			batch.map((post) =>
				post.id === action.id
					? {
							...post,
							isLiked: post.isLiked === true ? undefined : true,
							upvotes: post.upvotes + 1,
							downvotes:
								post.isLiked === false ? post.downvotes - 1 : post.downvotes,
						}
					: post,
			),
		);
		const latestPosts = state.latest.posts?.map((batch) =>
			batch.map((post) =>
				post.id === action.id
					? { ...post, isLiked: post.isLiked === true ? undefined : true }
					: post,
			),
		);

		return {
			...state,
			home: { ...state.home, posts: homePosts ?? null },
			latest: { ...state.latest, posts: latestPosts ?? null },
		};
	}),
	on(postDisliked, (state, action) => {
		const homePosts = state.home.posts?.map((batch) =>
			batch.map((post) =>
				post.id === action.id
					? {
							...post,
							isLiked: post.isLiked === false ? undefined : false,
							upvotes: post.isLiked === true ? post.upvotes - 1 : post.upvotes,
							downvotes: post.downvotes - 1,
						}
					: post,
			),
		);
		const latestPosts = state.latest.posts?.map((batch) =>
			batch.map((post) =>
				post.id === action.id
					? {
							...post,
							isLiked: post.isLiked === false ? undefined : false,
							upvotes: post.isLiked === true ? post.upvotes - 1 : post.upvotes,
							downvotes: post.downvotes - 1,
						}
					: post,
			),
		);

		return {
			...state,
			home: { ...state.home, posts: homePosts ?? null },
			latest: { ...state.latest, posts: latestPosts ?? null },
		};
	}),
);
