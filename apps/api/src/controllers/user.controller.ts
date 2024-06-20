import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { ApiResponse, User, UserDto } from "common";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { UserException } from "src/features/exception-handling/exceptions/user.exception";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
import { UserFactoryService } from "src/features/user/user-factory.service";
import { UserRepositoryService } from "src/features/user/user-repository.service";

@Controller("/users")
export class UserController {
  constructor(
    private userRepositoryService: UserRepositoryService,
    private userFactoryService: UserFactoryService,
    private cachingServices: ICachingServices,
  ) {}

  @HttpCode(200)
  @Get("/user/:userId")
  public async getUserById(
    @Param("userId", ParseObjectIdPipe.stringified()) userId: string,
  ): ApiResponse<UserDto> {
    const cachedUser = await this.cachingServices.get<User>(
      `user:${userId}`,
      true,
    );

    if (cachedUser)
      return {
        data: this.userFactoryService.createDto(cachedUser),
      };

    const user = await this.userRepositoryService.getUserById(userId);

    if (!user) throw new UserException.UserDoesNotExist();

    await this.cachingServices.set(`user:${userId}`, user);

    return {
      data: this.userFactoryService.createDto(user),
    };
  }
}
