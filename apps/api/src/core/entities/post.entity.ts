import { ObjectId } from "mongoose";
import { Community } from "./community.entity";
import { User } from "./user.entity";

export class Post {
	id: string;

	title: string;
	content: string;

	images: string[];

	// other non-image attachments
	files: string[];

	author?: User | ObjectId | string;
	community?: Community | ObjectId | string;

	likes: number;
	dislikes: number;

	createdAt: Date;
	updatedAt: Date;
}
