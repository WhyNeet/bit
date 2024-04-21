import { IsOptional, IsString, Length } from "class-validator";
import { ObjectId } from "mongoose";
import { User } from "../entities/user.entity";
import { ValidationError } from "../validation/error";
import { UserDto } from "./user.dto";

export class CreateCommunityDto {
	@IsString({ message: ValidationError.MustBeAString })
	@Length(2, 32, { message: ValidationError.MustBeBetweenChars(2, 32) })
	name: string;

	@IsOptional()
	@IsString({ message: ValidationError.MustBeAString })
	@Length(1, 256, { message: ValidationError.MustBeBetweenChars(1, 256) })
	description?: string;
}

export class CommunityDto {
	id: string;
	name: string;
	description?: string;
	author?: UserDto | ObjectId | string;
	createdAt: Date;
	updatedAt: Date;
}
