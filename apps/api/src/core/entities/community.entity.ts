import { ObjectId } from "mongoose";
import { User } from "./user.entity";

export class Community {
	id: string;
	name: string;
	description?: string;

	owner?: User | ObjectId | string;

	createdAt: Date;
	updatedAt: Date;
}
