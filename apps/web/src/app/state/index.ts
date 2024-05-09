import { AppReducers } from "./appState.interface";
import { reducers as postsReducers } from "./posts/reducers";
import { reducers as userReducers } from "./user/reducers";

export const reducers: AppReducers = {
	user: userReducers,
	posts: postsReducers,
};
