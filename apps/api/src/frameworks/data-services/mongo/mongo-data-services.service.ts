import { Injectable, type OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import type { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Token, type TokenDocument } from "./model/token.model";
import { User, type UserDocument } from "./model/user.model";
import { MongoGenericRepository } from "./mongo-generic-repository";

@Injectable()
export class MongoDataServices
	implements IDataServices, OnApplicationBootstrap
{
	public users: MongoGenericRepository<User>;
	public tokens: MongoGenericRepository<Token>;

	constructor(
		@InjectModel(User.name) private UserModel: Model<UserDocument>,
		@InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
	) {}

	onApplicationBootstrap() {
		this.users = new MongoGenericRepository<User>(this.UserModel);
		this.tokens = new MongoGenericRepository<Token>(this.TokenModel);
	}
}
