import { Injectable, type OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "common";
import type { Model } from "mongoose";
import type { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Community, CommunityDocument } from "./model/community.model";
import { PostDocument } from "./model/post.model";
import {
	UserCommunityRelation,
	UserCommunityRelationDocument,
} from "./model/relation/user-community.model";
import {
	UserPostRelation,
	UserPostRelationDocument,
} from "./model/relation/user-post.model";
import { Token, type TokenDocument } from "./model/token.model";
import { User, type UserDocument } from "./model/user.model";
import { MongoGenericRepository } from "./mongo-generic-repository";

@Injectable()
export class MongoDataServices
	implements IDataServices, OnApplicationBootstrap
{
	public users: MongoGenericRepository<User>;
	public tokens: MongoGenericRepository<Token>;
	public communities: MongoGenericRepository<Community>;
	public posts: MongoGenericRepository<Post>;

	public userCommunityRelations: MongoGenericRepository<UserCommunityRelation>;
	public userPostRelations: MongoGenericRepository<UserPostRelation>;

	constructor(
		@InjectModel(User.name) private UserModel: Model<UserDocument>,
		@InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
		@InjectModel(Community.name)
		private CommunityModel: Model<CommunityDocument>,
		@InjectModel(Post.name) private PostModel: Model<PostDocument>,
		@InjectModel(UserCommunityRelation.name)
		private UserCommunityRelationModel: Model<UserCommunityRelationDocument>,
		@InjectModel(UserPostRelation.name)
		private UserPostRelationModel: Model<UserPostRelationDocument>,
	) {}

	onApplicationBootstrap() {
		this.users = new MongoGenericRepository<User>(this.UserModel);
		this.tokens = new MongoGenericRepository<Token>(this.TokenModel);
		this.communities = new MongoGenericRepository<Community>(
			this.CommunityModel,
		);
		this.posts = new MongoGenericRepository<Post>(this.PostModel);

		this.userCommunityRelations =
			new MongoGenericRepository<UserCommunityRelation>(
				this.UserCommunityRelationModel,
			);
		this.userPostRelations = new MongoGenericRepository<UserPostRelation>(
			this.UserPostRelationModel,
		);
	}
}
