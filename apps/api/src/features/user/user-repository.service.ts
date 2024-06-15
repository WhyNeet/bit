import { Injectable } from "@nestjs/common";
import { User } from "common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { CreateUserDto } from "src/core/dtos/user.dto";
import { AuthException } from "../exception-handling/exceptions/auth.exception";
import { UserFactoryService } from "./user-factory.service";

@Injectable()
export class UserRepositoryService {
	constructor(
		private dataServices: IDataServices,
		private userFactoryService: UserFactoryService,
	) {}

	public async createUser(createUserDto: CreateUserDto): Promise<User> {
		const user = this.userFactoryService.createFromDto(createUserDto);

		try {
			return await this.dataServices.users.create(user);
		} catch (e) {
			if (e.code && e.code === 11000)
				throw new AuthException.UserAlreadyExists(
					e.keyValue
						? `User with this ${Object.keys(e.keyValue)[0]} already exists.`
						: undefined,
				);
			throw e;
		}
	}

	public async getUsersById(ids: string[], limit?: number): Promise<User[]> {
		return this.dataServices.users.getAll({ _id: { $in: ids } }, {}, limit, 0);
	}

	public getUserById(id: string): Promise<User | null> {
		return this.dataServices.users.getById(id);
	}

	public getUserByEmail(email: string): Promise<User | null> {
		return this.dataServices.users.get({ email });
	}

	public getUserByUsername(username: string): Promise<User | null> {
		return this.dataServices.users.get({ username });
	}

	public updateUser(id: string, user: User): Promise<User | null> {
		return this.dataServices.users.update({ _id: id }, user);
	}

	public deleteUser(id: string): Promise<User | null> {
		return this.dataServices.users.delete({ _id: id });
	}
}
