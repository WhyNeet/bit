import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaTypes } from "mongoose";
import { Post } from "./post.model";
import { User } from "./user.model";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  id: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: "User" })
  author: User;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: "Post" })
  post: Post;

  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
