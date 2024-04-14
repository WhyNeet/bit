import { Injectable, type OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import type { IDataServices } from "src/core/abstracts/data-services.abstract";
import { User, type UserDocument } from "./model/user";
import { MongoGenericRepository } from "./mongo-generic-repository";

@Injectable()
export class MongoDataServices
	implements IDataServices, OnApplicationBootstrap
{
	public users: MongoGenericRepository<User>;

	constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

	onApplicationBootstrap() {
		this.users = new MongoGenericRepository<User>(this.UserModel);
	}
}
