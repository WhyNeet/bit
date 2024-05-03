import { Post } from "../post.entity";
import { User } from "../user.entity";

export enum UserPostRelationType {
	Like = "LIKE",
	Dislike = "DISLIKE",
}

export class UserPostRelation {
	user: string | User;
	post: string | Post;
	type: UserPostRelationType;
}
