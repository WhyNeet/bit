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

	upvotes: number;
	downvotes: number;
	// true if is liked by current user, false if disliked, undefined if neither
	isLiked?: boolean;

	createdAt: Date;
	updatedAt: Date;
}
