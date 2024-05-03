import {
	ArrayMaxSize,
	IsOptional,
	IsString,
	Length,
	MinLength,
} from "class-validator";
import {
	HasMimeType,
	IsFiles,
	MaxFileSize,
	MemoryStoredFile,
} from "nestjs-form-data";
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

	@IsOptional()
	@IsFiles({ message: ValidationError.MustBeAFile })
	@MaxFileSize(3000000, {
		message: ValidationError.MaxFileSizeExceeded,
		each: true,
	})
	@HasMimeType("image/*", {
		message: ValidationError.InvalidMimeType("image/*"),
		each: true,
	})
	@ArrayMaxSize(3, { message: ValidationError.TooManyFiles(3) })
	images: MemoryStoredFile[];

	@IsOptional()
	@IsFiles({ message: ValidationError.MustBeAFile })
	@MaxFileSize(3000000, {
		message: ValidationError.MaxFileSizeExceeded,
		each: true,
	})
	@ArrayMaxSize(3, { message: ValidationError.TooManyFiles(3) })
	files: MemoryStoredFile[];
}

export class UpdatePostDto {
	@IsString({ message: ValidationError.MustBeAString })
	@Length(1, 256, { message: ValidationError.MustBeBetweenChars(1, 256) })
	title: string;

	@IsString({ message: ValidationError.MustBeAString })
	@MinLength(1, { message: ValidationError.MustBeAtLeastChars(1) })
	content: string;

	@IsOptional()
	@IsFiles({ message: ValidationError.MustBeAFile })
	@MaxFileSize(3000000, {
		message: ValidationError.MaxFileSizeExceeded,
		each: true,
	})
	@HasMimeType("image/*", {
		message: ValidationError.InvalidMimeType("image/*"),
		each: true,
	})
	@ArrayMaxSize(3, { message: ValidationError.TooManyFiles(3) })
	images: MemoryStoredFile[];

	@IsOptional()
	@IsFiles({ message: ValidationError.MustBeAFile })
	@MaxFileSize(3000000, {
		message: ValidationError.MaxFileSizeExceeded,
		each: true,
	})
	@ArrayMaxSize(3, { message: ValidationError.TooManyFiles(3) })
	files: MemoryStoredFile[];
}

export class PostDto {
	id: string;

	title: string;
	content: string;

	images: string[];
	files: string[];

	author?: UserDto | string;
	community?: CommunityDto | string;

	likes: number;
	// dislikes are only visible to authors
	dislikes?: number;

	createdAt: Date;
	updatedAt: Date;
}
