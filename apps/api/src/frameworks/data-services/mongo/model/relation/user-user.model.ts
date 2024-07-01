import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserUserRelationType } from "common";
import { HydratedDocument, Schema as SchemaTypes } from "mongoose";
import { User } from "../user.model";

export type UserUserRelationDocument = HydratedDocument<UserUserRelation>;

@Schema()
export class UserUserRelation {
  @Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: "User" })
  user_a: User;

  @Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: "User" })
  user_b: User;

  @Prop({ required: true, type: String, enum: UserUserRelationType })
  type: UserUserRelationType;
}

export const UserUserRelationSchema =
  SchemaFactory.createForClass(UserUserRelation);
