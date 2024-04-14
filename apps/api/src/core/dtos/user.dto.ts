import { IsEmail, IsString, Length, Matches } from "class-validator";
import { ValidationError } from "../validation/error";

export class CreateUserDto {
	@IsEmail({}, { message: ValidationError.InvalidEmail })
	@IsString({ message: ValidationError.MustBeAString })
	email: string;

	@IsString({ message: ValidationError.MustBeAString })
	@Matches(/^[0-9A-Za-z_-]{2,32}$/, {
		message: ValidationError.InvalidUsername,
	})
	username: string;

	@IsString({ message: ValidationError.MustBeAString })
	@Length(8, 72, { message: ValidationError.BadPasswordLength })
	password: string;

	@IsString({ message: ValidationError.MustBeAString })
	name: string;
}

export class UserDto {
	id: string;
	email: string;
	username: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}
