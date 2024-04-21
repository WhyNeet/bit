import { HttpStatus } from "@nestjs/common";
import { CommonException } from "src/frameworks/exception-handling/decorators/common-exception.decorator";
import { Exception } from "src/frameworks/exception-handling/types/exception.interface";

// biome-ignore lint/complexity/noStaticOnlyClass: grouping
export class AuthException {
	@CommonException(
		"User does not exist.",
		"User with this email does not exist.",
		HttpStatus.BAD_REQUEST,
	)
	public static readonly UserDoesNotExist: Exception;

	@CommonException(
		"Wrong password.",
		"Please try again with the correct password.",
		HttpStatus.BAD_REQUEST,
	)
	public static readonly WrongPassword: Exception;
}
