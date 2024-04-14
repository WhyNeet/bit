import type { User } from "../entities/user.entity";
import type { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
	abstract users: IGenericRepository<User>;
}
