import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongoose";
import {
	UserCommunityRelation,
	UserCommunityRelationType,
} from "src/core/entities/relation/user-community.entity";

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
}
