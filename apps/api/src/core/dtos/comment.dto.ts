import { IsString, Length } from "class-validator";
import { IsObjectId } from "../validation/decorators/ObjectId";
import { ValidationError } from "../validation/error";

export class CreateCommentDto {
  @IsString({ message: ValidationError.MustBeAString })
  @Length(1, 512, { message: ValidationError.MustBeBetweenChars(1, 512) })
  content: string;

  @IsObjectId({ message: ValidationError.MustBeAnObjectId })
  post: string;
}

export class UpdateCommentDto {
  @IsString({ message: ValidationError.MustBeAString })
  @Length(1, 512, { message: ValidationError.MustBeBetweenChars(1, 512) })
  content: string;
}
