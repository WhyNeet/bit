import { createAction, props } from "@ngrx/store";
import { PostDto } from "common";

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
