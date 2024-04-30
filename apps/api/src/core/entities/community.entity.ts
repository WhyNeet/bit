import { ObjectId } from "mongoose";
import { User } from "./user.entity";

export class Community {
	id: string;
	name: string;
	description?: string;

	owner: User | ObjectId;
	members: number;

	createdAt: Date;
	updatedAt: Date;
}
