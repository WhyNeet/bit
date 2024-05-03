import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaTypes } from "mongoose";
import { UserPostRelationType } from "src/core/entities/relation/user-post.entity";
import { Post } from "../post.model";
import { User } from "../user.model";

export type UserPostRelationDocument = HydratedDocument<UserPostRelation>;

@Schema()
export class UserPostRelation {
	@Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: "User" })
	user: User;

	@Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: "Post" })
	post: Post;

	@Prop({ required: true, type: String, enum: UserPostRelationType })
	type: UserPostRelationType;
}

export const UserPostRelationSchema =
	SchemaFactory.createForClass(UserPostRelation);
