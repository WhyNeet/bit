import { PostDto } from "common";

export interface PostsState {
	home: PostDto[] | null;
	latest: PostDto[] | null;
}
