import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserCommunityRelationType } from "common";
import { HydratedDocument, Schema as SchemaTypes } from "mongoose";
import { Community } from "../community.model";
import { User } from "../user.model";

export type UserCommunityRelationDocument =
	HydratedDocument<UserCommunityRelation>;

@Schema()
export class UserCommunityRelation {
	@Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: "User" })
	user: User;

	@Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: "Community" })
	community: Community;

	@Prop({ required: true, type: String, enum: UserCommunityRelationType })
	type: UserCommunityRelationType;
}

export const UserCommunityRelationSchema = SchemaFactory.createForClass(
	UserCommunityRelation,
);
