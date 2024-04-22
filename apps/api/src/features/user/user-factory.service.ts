import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { CreateUserDto, UserDto } from "src/core/dtos/user.dto";
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

	public createDto(user: User): UserDto {
		const userDto = new UserDto();

		userDto.id = user.id;
		userDto.username = user.username;
		userDto.email = user.email;
		userDto.name = user.name;
		userDto.createdAt = user.createdAt;
		userDto.updatedAt = user.updatedAt;

		return userDto;
	}

	public createDtoOrString(user: User | Types.ObjectId): UserDto | string {
		if (user instanceof Types.ObjectId) return user.toString();

		return this.createDto(user);
	}
}
