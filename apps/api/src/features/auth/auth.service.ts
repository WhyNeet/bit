import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "common";
import type { CreateUserDto } from "src/core/dtos/user.dto";
import { UserRepositoryService } from "../user/user-repository.service";

@Injectable()
export class AuthService {
  constructor(private userRepositoryService: UserRepositoryService) {}

  public async registerUser(user: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      user.password,
      await bcrypt.genSalt(),
    );
    user.password = hashedPassword;

    return await this.userRepositoryService.createUser(user);
  }
}
