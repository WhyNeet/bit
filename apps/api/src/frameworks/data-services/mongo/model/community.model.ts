import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaTypes } from "mongoose";
import { User } from "./user.model";

export type CommunityDocument = HydratedDocument<Community>;

@Schema({ timestamps: true })
export class Community {
	id: string;

	@Prop({ required: true, unique: true })
	name: string;

	@Prop({ required: false })
	description?: string;

	@Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: "User" })
	owner: User;

	createdAt: Date;
	updatedAt: Date;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
