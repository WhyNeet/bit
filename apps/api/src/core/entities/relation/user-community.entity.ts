import { ObjectId } from "mongoose";
import { Community } from "../community.entity";
import { User } from "../user.entity";

export enum UserCommunityRelationType {
	Join = "JOIN",
}

export class UserCommunityRelation {
	user: User | ObjectId;
	community: Community | ObjectId;
	type: UserCommunityRelationType;
}
