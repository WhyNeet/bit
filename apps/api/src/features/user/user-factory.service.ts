import { Injectable } from "@nestjs/common";
import type { CreateUserDto } from "src/core/dtos/user.dto";
import { User } from "src/core/entities/user.entity";

@Injectable()
export class UserFactoryService {
	public createFromDto(createUserDto: CreateUserDto): User {
		const user = new User();

		user.username = createUserDto.username;
		user.email = createUserDto.email;
		user.password = createUserDto.password;
		user.name = createUserDto.name;

		return user;
	}
}
