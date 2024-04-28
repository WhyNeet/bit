import { HttpStatus } from "@nestjs/common";
import { CommonException } from "src/frameworks/exception-handling/decorators/common-exception.decorator";
import { Exception } from "src/frameworks/exception-handling/types/exception.interface";

// biome-ignore lint/complexity/noStaticOnlyClass: grouping
export class PostException {
	@CommonException(
		"Post does not exist.",
		"Post with this identitier does not exist.",
		HttpStatus.BAD_REQUEST,
	)
	public static readonly PostDoesNotExist: Exception;

	@CommonException(
		"Post cannot be modified.",
		"Only post or community owner is allowed to modify this post.",
		HttpStatus.FORBIDDEN,
	)
	public static readonly PostCannotBeModified: Exception;
}
