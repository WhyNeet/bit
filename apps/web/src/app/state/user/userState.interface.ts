import { CommunityDto, UserDto } from "common";

export interface UserState {
	isLoading: boolean;
	user: UserDto | null;
	communities: CommunityDto[] | null;
}
