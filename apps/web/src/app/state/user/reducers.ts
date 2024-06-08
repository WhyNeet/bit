import { createReducer, on } from "@ngrx/store";
import { loggedIn, loggedOut } from "./actions";
import { UserState } from "./userState.interface";

export const initialState: UserState = {
	isLoading: true,
	user: null,
	communities: null,
};

export const reducers = createReducer(
	initialState,
	on(loggedIn, (state, action) => ({
		...state,
		isLoading: false,
		user: action.user,
	})),
	on(loggedOut, (_) => ({ communities: null, isLoading: false, user: null })),
);
