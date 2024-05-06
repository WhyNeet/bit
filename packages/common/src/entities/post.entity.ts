import { Community } from "./community.entity";
import { User } from "./user.entity";

export class Post {
	id: string;

	title: string;
	content: string;

	images: string[];

	// other non-image attachments
	files: string[];

	author?: User | string;
	community?: Community | string;

	likes: number;
	dislikes: number;

	createdAt: Date;
	updatedAt: Date;
}
