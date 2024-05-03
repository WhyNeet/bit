import { Post } from "../post.entity";
import { User } from "../user.entity";

export enum UserPostRelationType {
	Like = "LIKE",
}

export class UserPostRelation {
	user: string | User;
	post: string | Post;
	type: UserPostRelationType;
}
