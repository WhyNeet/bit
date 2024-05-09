import { createAction, props } from "@ngrx/store";
import { UserDto } from "common";

export const loggedIn = createAction(
	"[User] Logged In",
	props<{ user: UserDto }>(),
);
export const loggedOut = createAction("[User] Logged Out");
