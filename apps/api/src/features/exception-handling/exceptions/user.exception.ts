import { HttpStatus } from "@nestjs/common";
import { CommonException } from "src/frameworks/exception-handling/decorators/common-exception.decorator";
import { Exception } from "src/frameworks/exception-handling/types/exception.interface";

// biome-ignore lint/complexity/noStaticOnlyClass: grouping
export class UserException {
	@CommonException(
		"User does not exist.",
		"Uset with this identifier does not exist.",
		HttpStatus.BAD_REQUEST,
	)
	public static readonly UserDoesNotExist: Exception;
}
