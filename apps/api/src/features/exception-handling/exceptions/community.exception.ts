import { HttpStatus } from "@nestjs/common";
import { CommonException } from "src/frameworks/exception-handling/decorators/common-exception.decorator";
import { Exception } from "src/frameworks/exception-handling/types/exception.interface";

// biome-ignore lint/complexity/noStaticOnlyClass: grouping
export class CommunityException {
  @CommonException(
    "Community does not exist.",
    "Community with this identifier does not exist.",
    HttpStatus.BAD_REQUEST,
  )
  public static readonly CommunityDoesNotExist: Exception;

  @CommonException(
    "Community cannot be modified.",
    "Only owner is allowed to modify or delete a community.",
    HttpStatus.FORBIDDEN,
  )
  public static readonly CommunityCannotBeModified: Exception;

  @CommonException(
    "Community already exists.",
    "Community with this name already exists.",
    HttpStatus.FORBIDDEN,
  )
  public static readonly CommunityAlreadyExists: Exception;
}
