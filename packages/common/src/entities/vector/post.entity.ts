import { CommunityDto, UserDto } from "src/dtos";

export class PostVectorData {
	id: string;
	title: string;
	vector: number[];
	author: string;
	community: string | undefined;
}

export class PostVectorDataDto {
	id: string;
	title: string;
	vector: number[];
	author: string | UserDto;
	community: string | CommunityDto | undefined;
}
