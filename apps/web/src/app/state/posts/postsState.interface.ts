import { PostDto } from "common";

export interface PostsState {
  home: Posts;
  latest: Posts;
}

export interface Posts {
  posts: PostDto[][] | null;
  isLoading: boolean;
}
