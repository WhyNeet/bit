import {
  ArrayMaxSize,
  IsNotEmpty,
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

export class CreatePostDto {
  @IsString({ message: ValidationError.MustBeAString })
  @Length(1, 256, { message: ValidationError.MustBeBetweenChars(1, 256) })
  title: string;

  @IsString({ message: ValidationError.MustBeAString })
  @MinLength(1, { message: ValidationError.MustBeAtLeastChars(1) })
  content: string;

  @IsOptional()
  @IsString({ message: ValidationError.MustBeAString })
  @IsObjectId({ message: ValidationError.MustBeAnObjectId })
  community: string | undefined;

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

export class PostsSearchQueryDto {
  @IsString({ message: ValidationError.MustBeAString })
  @IsNotEmpty({ message: ValidationError.MustBeAtLeastChars(1) })
  query: string;
}
