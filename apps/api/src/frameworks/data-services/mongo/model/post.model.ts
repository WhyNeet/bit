import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaTypes } from "mongoose";
import { Community } from "./community.model";
import { User } from "./user.model";

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
	id: string;

	@Prop({ required: true })
	title: string;
	@Prop({ required: true })
	content: string;

	@Prop({ required: true, type: [String] })
	images: string[];

	@Prop({ required: true, type: [String] })
	files: string[];

	@Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: "User" })
	author?: User;

	@Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: "Community" })
	community?: Community;

	@Prop({ required: true })
	upvotes: number;

	@Prop({ required: true })
	downvotes: number;

	createdAt: Date;
	updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
