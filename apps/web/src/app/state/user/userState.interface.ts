import { UserDto } from "common";

export interface UserState {
	isLoading: boolean;
	user: UserDto | null;
}
