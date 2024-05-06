import { CommunityDto } from "./community.dto";
import { UserDto } from "./user.dto";

export class CreatePostDto {
	title: string;

	content: string;

	community: string;

	images: string[];

	files: string[];
}

export class UpdatePostDto {
	title: string;

	content: string;

	images: string[];

	files: string[];
}

export class PostDto {
	id: string;

	title: string;
	content: string;

	images: string[];
	files: string[];

	author?: UserDto | string;
	community?: CommunityDto | string;

	likes: number;
	// dislikes are only visible to authors
	dislikes?: number;

	createdAt: Date;
	updatedAt: Date;
}
