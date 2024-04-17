import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
	id: string;

	@Prop({ required: true, type: Date, expires: 0 })
	expireAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
