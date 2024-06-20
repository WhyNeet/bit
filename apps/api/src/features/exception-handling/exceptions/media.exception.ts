import { HttpStatus } from "@nestjs/common";
import { CommonException } from "src/frameworks/exception-handling/decorators/common-exception.decorator";
import { Exception } from "src/frameworks/exception-handling/types/exception.interface";

// biome-ignore lint/complexity/noStaticOnlyClass: grouping
export class MediaException {
  @CommonException(
    "File does not exist.",
    "File with this identifier does not exist.",
    HttpStatus.BAD_REQUEST,
  )
  public static readonly FileDoesNotExist: Exception;
}
