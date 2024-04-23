import { IsString, Length, MinLength } from "class-validator";
import { IsObjectId } from "../validation/decorators/ObjectId";
import { ValidationError } from "../validation/error";
import { CommunityDto } from "./community.dto";
import { UserDto } from "./user.dto";

export class CreatePostDto {
	@IsString({ message: ValidationError.MustBeAString })
	@Length(1, 256, { message: ValidationError.MustBeBetweenChars(1, 256) })
	title: string;

	@IsString({ message: ValidationError.MustBeAString })
	@MinLength(1, { message: ValidationError.MustBeAtLeastChars(1) })
	content: string;

	@IsString({ message: ValidationError.MustBeAString })
	@IsObjectId({ message: ValidationError.MustBeAnObjectId })
	community: string;
}

export class PostDto {
	id: string;

	title: string;
	content: string;

	images: string[];
	files: string[];

	author?: UserDto | string;
	community?: CommunityDto | string;

	createdAt: Date;
	updatedAt: Date;
}
