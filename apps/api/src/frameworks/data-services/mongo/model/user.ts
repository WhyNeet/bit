import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
	id: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true, unique: true })
	username: string;

	@Prop({ required: true })
	name: string;

	@Prop()
	bio?: string;

	@Prop({ required: true })
	password: string;

	createdAt: Date;
	updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
