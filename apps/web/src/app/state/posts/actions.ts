import { createAction, props } from "@ngrx/store";
import { PostDto, UserPostRelation } from "common";

export const homePostsFetched = createAction(
  "[Posts] Home Posts Fetched",
  props<{ posts: PostDto[] }>(),
);

export const latestPostsFetched = createAction(
  "[Posts] Latest Posts Fetched",
  props<{ posts: PostDto[] }>(),
);

export const postsFetching = createAction(
  "[Posts] Fetching Posts",
  props<{ section: "home" | "latest" }>(),
);

export const postCreated = createAction(
  "[Posts] Post Created",
  props<{ post: PostDto }>(),
);
export const postUpdated = createAction(
  "[Posts] Post Updated",
  props<{ post: PostDto }>(),
);
export const postDeleted = createAction(
  "[Posts] Post Deleted",
  props<{ postId: string }>(),
);

export const postLiked = createAction(
  "[Posts] Post Liked",
  props<{ id: string }>(),
);
export const postLikeRemoved = createAction(
  "[Posts] Post Like Removed",
  props<{ id: string }>(),
);
export const postDisliked = createAction(
  "[Posts] Post Disliked",
  props<{ id: string }>(),
);
export const postDislikeRemoved = createAction(
  "[Posts] Post Dislike Removed",
  props<{ id: string }>(),
);

export const postVotingStateFetched = createAction(
  "[Posts] Voting State Fetched",
  props<{ state: Map<string, UserPostRelation> }>(),
);
