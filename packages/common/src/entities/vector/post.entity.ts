import { CommunityDto, UserDto } from "src/dtos";
import { Community } from "../community.entity";
import { User } from "../user.entity";

export class PostVectorData {
	id: string;
	title: string;
	vector: number[];
	author: string | User;
	community: string | Community | undefined;
}

export class PostVectorDataDto {
	id: string;
	title: string;
	vector: number[];
	author: string | UserDto;
	community: string | CommunityDto | undefined;
}
