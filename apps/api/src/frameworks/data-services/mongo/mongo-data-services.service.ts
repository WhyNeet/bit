import { Injectable, type OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import type { IDataServices } from "src/core/abstracts/data-services.abstract";
import { User, type UserDocument } from "./model/user";
import { MongoDataRepository } from "./mongo-data-repository";

@Injectable()
export class MongoDataServices
	implements IDataServices, OnApplicationBootstrap
{
	public users: MongoDataRepository<User>;

	constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

	onApplicationBootstrap() {
		this.users = new MongoDataRepository<User>(this.UserModel);
	}
}
