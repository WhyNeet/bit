import { ObjectId } from "mongoose";
import { User } from "./user.entity";

export class Community {
	id: string;
	name: string;
	description?: string;

	author?: User | ObjectId | string;

	createdAt: Date;
	updatedAt: Date;
}
