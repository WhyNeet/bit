import { createReducer, on } from "@ngrx/store";
import { loggedIn, loggedOut } from "./actions";
import { UserState } from "./userState.interface";

export const initialState: UserState = {
	isLoading: true,
	user: null,
};

export const reducers = createReducer(
	initialState,
	on(loggedIn, (_, action) => ({ isLoading: false, user: action.user })),
	on(loggedOut, (_) => ({ isLoading: false, user: null })),
);