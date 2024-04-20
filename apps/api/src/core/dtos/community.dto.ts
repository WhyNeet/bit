import { IsOptional, IsString, Length } from "class-validator";
import { User } from "../entities/user.entity";
import { ValidationError } from "../validation/error";

export class CreateCommunityDto {
	@IsString({ message: ValidationError.MustBeAString })
	@Length(2, 32, { message: ValidationError.MustBeBetween(2, 32) })
	name: string;

	@IsOptional()
	@IsString({ message: ValidationError.MustBeAString })
	@Length(1, 256, { message: ValidationError.MustBeBetween(1, 256) })
	description?: string;
}

export class CommunityDto {
	id: string;
	name: string;
	description?: string;
	author?: User | string;
	createdAt: Date;
	updatedAt: Date;
}
