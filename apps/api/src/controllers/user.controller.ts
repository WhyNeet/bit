import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserUserRelationType } from "common";
import { ApiResponse, User, UserDto } from "common";
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
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard)
  @Get("/user/:userId")
  public async getUserById(
    @Param("userId", ParseObjectIdPipe.stringified()) userId: string,
    @Token() payload?: JwtPayload,
  ): ApiResponse<UserDto> {
    const user = await this.userRepositoryService.getUserById(userId);

    if (!user) throw new UserException.UserDoesNotExist();

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
    if (followedUser.id === payload.sub)
      throw new UserException.UserCannotSelfFollow();

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

    if (!relation) throw new UserException.UserIsNotFollowed();

    return {
      data: null,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("/:userId/is_following")
  public async isFollowingUser(
    @Param("userId", ParseObjectIdPipe.stringified()) userId: string,
    @Token() payload: JwtPayload,
  ): ApiResponse<boolean> {
    const relation = await this.userRepositoryService.getRelation(
      payload.sub,
      userId,
      UserUserRelationType.Follow,
    );

    return {
      data: !!relation,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get("/:userId/followers")
  public async getUserFollowers(
    @Param("userId", ParseObjectIdPipe.stringified()) userId: string,
  ): ApiResponse<UserDto[]> {
    const users = await this.userRepositoryService.getFollowers(userId);

    return {
      data: users.map(
        this.userFactoryService.createDto.bind(this.userFactoryService),
      ),
    };
  }
}
