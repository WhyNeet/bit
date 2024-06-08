import { createAction, props } from "@ngrx/store";
import { CommunityDto, UserDto } from "common";

export const loggedIn = createAction(
	"[User] Logged In",
	props<{ user: UserDto }>(),
);
export const loggedOut = createAction("[User] Logged Out");

export const userCommunitiesFetched = createAction(
	"[User] Communities Fetched",
	props<{ communities: CommunityDto[] }>(),
);
