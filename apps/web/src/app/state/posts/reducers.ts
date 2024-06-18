import { createReducer, on } from "@ngrx/store";
import { PostDto, UserPostRelationType } from "common";
import {
	homePostsFetched,
	latestPostsFetched,
	postCreated,
	postDislikeRemoved,
	postDisliked,
	postLikeRemoved,
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
		const mapper = (batch: PostDto[]) =>
			batch.map((post) =>
				post.id === action.id
					? {
							...post,
							votingState: UserPostRelationType.Upvote,
							upvotes: post.upvotes + 1,
							downvotes:
								post.votingState === UserPostRelationType.Downvote
									? post.downvotes - 1
									: post.downvotes,
						}
					: post,
			);

		const homePosts = state.home.posts?.map(mapper);
		const latestPosts = state.latest.posts?.map(mapper);

		return {
			...state,
			home: { ...state.home, posts: homePosts ?? null },
			latest: { ...state.latest, posts: latestPosts ?? null },
		};
	}),
	on(postDisliked, (state, action) => {
		const mapper = (batch: PostDto[]) =>
			batch.map((post) =>
				post.id === action.id
					? {
							...post,
							votingState: UserPostRelationType.Downvote,
							upvotes:
								post.votingState === UserPostRelationType.Upvote
									? post.upvotes - 1
									: post.upvotes,
							downvotes: post.downvotes + 1,
						}
					: post,
			);

		const homePosts = state.home.posts?.map(mapper);
		const latestPosts = state.latest.posts?.map(mapper);

		return {
			...state,
			home: { ...state.home, posts: homePosts ?? null },
			latest: { ...state.latest, posts: latestPosts ?? null },
		};
	}),
	on(postDislikeRemoved, (state, action) => {
		const mapper = (batch: PostDto[]) =>
			batch.map((post) =>
				post.id === action.id
					? {
							...post,
							votingState: null,
							downvotes: post.downvotes - 1,
						}
					: post,
			);

		const homePosts = state.home.posts?.map(mapper);
		const latestPosts = state.latest.posts?.map(mapper);

		return {
			...state,
			home: { ...state.home, posts: homePosts ?? null },
			latest: { ...state.latest, posts: latestPosts ?? null },
		};
	}),
	on(postLikeRemoved, (state, action) => {
		const mapper = (batch: PostDto[]) =>
			batch.map((post) =>
				post.id === action.id
					? {
							...post,
							votingState: null,
							upvotes: post.upvotes - 1,
						}
					: post,
			);

		const homePosts = state.home.posts?.map(mapper);
		const latestPosts = state.latest.posts?.map(mapper);

		return {
			...state,
			home: { ...state.home, posts: homePosts ?? null },
			latest: { ...state.latest, posts: latestPosts ?? null },
		};
	}),
);
