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
