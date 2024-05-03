import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongoose";
import {
	UserCommunityRelation,
	UserCommunityRelationType,
} from "src/core/entities/relation/user-community.entity";
import {
	UserPostRelation,
	UserPostRelationType,
} from "src/core/entities/relation/user-post.entity";

@Injectable()
export class RelationFactoryService {
	public createUserCommunityRelation(
		userId: string,
		communityId: string,
		type: UserCommunityRelationType,
	): UserCommunityRelation {
		const relation = new UserCommunityRelation();

		relation.user = userId;
		relation.community = communityId;
		relation.type = type;

		return relation;
	}

	public createUserPostRelation(
		userId: string,
		postId: string,
		type: UserPostRelationType,
	): UserPostRelation {
		const relation = new UserPostRelation();

		relation.user = userId;
		relation.post = postId;
		relation.type = type;

		return relation;
	}
}
