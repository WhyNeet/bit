import { Controller, Get, HttpCode, Param, UseGuards } from "@nestjs/common";
import { ApiResponse, User, UserDto } from "common";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { UserException } from "src/features/exception-handling/exceptions/user.exception";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
import { UserFactoryService } from "src/features/user/user-factory.service";
import { UserRepositoryService } from "src/features/user/user-repository.service";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { OptionalJwtAuthGuard } from "src/frameworks/auth/guards/optional-jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/users")
export class UserController {
  constructor(
    private userRepositoryService: UserRepositoryService,
    private userFactoryService: UserFactoryService,
    private cachingServices: ICachingServices,
  ) {}

  @HttpCode(200)
  @UseGuards(OptionalJwtAuthGuard)
  @Get("/user/:userId")
  public async getUserById(
    @Param("userId", ParseObjectIdPipe.stringified()) userId: string,
    @Token() payload?: JwtPayload,
  ): ApiResponse<UserDto> {
    const cachedUser = await this.cachingServices.get<User>(
      `user:${userId}`,
      true,
    );

    if (cachedUser)
      return {
        data: this.userFactoryService.createDto(
          cachedUser,
          payload.sub === cachedUser.id,
        ),
      };

    const user = await this.userRepositoryService.getUserById(userId);

    if (!user) throw new UserException.UserDoesNotExist();

    await this.cachingServices.set(`user:${userId}`, user);

    return {
      data: this.userFactoryService.createDto(user, payload.sub === user.id),
    };
  }
}
