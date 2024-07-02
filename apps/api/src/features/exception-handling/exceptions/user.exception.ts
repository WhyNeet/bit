import { HttpStatus } from "@nestjs/common";
import { CommonException } from "src/frameworks/exception-handling/decorators/common-exception.decorator";
import { Exception } from "src/frameworks/exception-handling/types/exception.interface";

// biome-ignore lint/complexity/noStaticOnlyClass: grouping
export class UserException {
  @CommonException(
    "User does not exist.",
    "User with this identifier does not exist.",
    HttpStatus.BAD_REQUEST,
  )
  public static readonly UserDoesNotExist: Exception;

  @CommonException(
    "User cannot self-follow.",
    "Only another user can be followed.",
    HttpStatus.BAD_REQUEST,
  )
  public static readonly UserCannotSelfFollow: Exception;

  @CommonException(
    "User is not followed.",
    "Cannot unfollow this user.",
    HttpStatus.BAD_REQUEST,
  )
  public static readonly UserIsNotFollowed: Exception;
}
