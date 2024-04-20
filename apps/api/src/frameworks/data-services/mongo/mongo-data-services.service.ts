import { Injectable, type OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import type { IDataServices } from "src/core/abstracts/data-services.abstract";
import { IGenericRepository } from "src/core/abstracts/generic-repository.abstract";
import { Community, CommunityDocument } from "./model/community.model";
import { Token, type TokenDocument } from "./model/token.model";
import { User, type UserDocument } from "./model/user.model";
import { MongoGenericRepository } from "./mongo-generic-repository";

@Injectable()
export class MongoDataServices
	implements IDataServices, OnApplicationBootstrap
{
	public users: MongoGenericRepository<User>;
	public tokens: MongoGenericRepository<Token>;
	public communities: IGenericRepository<Community>;

	constructor(
		@InjectModel(User.name) private UserModel: Model<UserDocument>,
		@InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
		@InjectModel(Community.name)
		private CommunityModel: Model<CommunityDocument>,
	) {}

	onApplicationBootstrap() {
		this.users = new MongoGenericRepository<User>(this.UserModel);
		this.tokens = new MongoGenericRepository<Token>(this.TokenModel);
		this.communities = new MongoGenericRepository<Community>(
			this.CommunityModel,
		);
	}
}
