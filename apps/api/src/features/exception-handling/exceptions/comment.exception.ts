import { HttpStatus } from "@nestjs/common";
import { CommonException } from "src/frameworks/exception-handling/decorators/common-exception.decorator";
import { Exception } from "src/frameworks/exception-handling/types/exception.interface";

// biome-ignore lint/complexity/noStaticOnlyClass: grouping
export class CommentException {
  @CommonException(
    "Comment cannot be modified.",
    "Only comment owner is allowed to modify this comment.",
    HttpStatus.FORBIDDEN,
  )
  public static readonly CommentCannotBeModified: Exception;
}
