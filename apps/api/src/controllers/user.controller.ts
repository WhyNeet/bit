import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserUserRelation } from "common";
import { ApiResponse, User, UserDto } from "common";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { UserException } from "src/features/exception-handling/exceptions/user.exception";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
import { UserFactoryService } from "src/features/user/user-factory.service";
import { UserRepositoryService } from "src/features/user/user-repository.service";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { OptionalJwtAuthGuard } from "src/frameworks/auth/guards/optional-jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/users")
export class UserController {
  constructor(
    private userRepositoryService: UserRepositoryService,
    private userFactoryService: UserFactoryService,
    private cachingServices: ICachingServices,
  ) {}

  @HttpCode(HttpStatus.OK)
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
          payload?.sub === (cachedUser as unknown as { _id: string })._id,
        ),
      };

    const user = await this.userRepositoryService.getUserById(userId);

    if (!user) throw new UserException.UserDoesNotExist();

    await this.cachingServices.set(`user:${userId}`, user);

    return {
      data: this.userFactoryService.createDto(user, payload?.sub === user.id),
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post("/:userId/follow")
  public async followUser(
    @Param("userId", ParseObjectIdPipe.stringified()) userId: string,
    @Token() payload: JwtPayload,
  ): ApiResponse<null> {
    const followedUser = await this.userRepositoryService.getUserById(userId);

    if (!followedUser) throw new UserException.UserDoesNotExist();

    const relation = await this.userRepositoryService.followUser(
      payload.sub,
      userId,
    );

    return {
      data: null,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post("/:userId/unfollow")
  public async unfollowUser(
    @Param("userId", ParseObjectIdPipe.stringified()) userId: string,
    @Token() payload: JwtPayload,
  ): ApiResponse<null> {
    const relation = await this.userRepositoryService.unfollowUser(
      payload.sub,
      userId,
    );

    if (!relation) throw new UserException.UserDoesNotExist();

    return {
      data: null,
    };
  }
}
