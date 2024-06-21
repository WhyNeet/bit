import { AppReducers } from "./appState.interface";
import { reducers as commentsReducers } from "./comments/reducers";
import { reducers as postsReducers } from "./posts/reducers";
import { reducers as searchReducers } from "./search/reducers";
import { reducers as userReducers } from "./user/reducers";

export const reducers: AppReducers = {
  user: userReducers,
  posts: postsReducers,
  search: searchReducers,
  comments: commentsReducers,
};
