import { User } from "./user.entity";

export class Community {
	id: string;
	name: string;
	description?: string;

	author?: User | string;

	createdAt: Date;
	updatedAt: Date;
}
