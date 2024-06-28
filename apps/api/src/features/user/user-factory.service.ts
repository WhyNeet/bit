import { Injectable } from "@nestjs/common";
import { User, UserDto } from "common";
import { CreateUserDto } from "src/core/dtos/user.dto";

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

  public createDto(user: User, isFull?: boolean): UserDto {
    const userDto = new UserDto();

    userDto.id = user.id ? user.id : (user as unknown as { _id: string })._id;
    userDto.username = user.username;
    userDto.email = isFull ? user.email : undefined;
    userDto.bio = user.bio;
    userDto.name = user.name;
    userDto.createdAt = user.createdAt;
    userDto.updatedAt = user.updatedAt;

    return userDto;
  }
}
