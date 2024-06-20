import { IsOptional, IsString, Length, Matches } from "class-validator";
import { ValidationError } from "../validation/error";

export class CreateCommunityDto {
  @IsString({ message: ValidationError.MustBeAString })
  @Length(2, 32, { message: ValidationError.MustBeBetweenChars(2, 32) })
  name: string;

  @IsOptional()
  @IsString({ message: ValidationError.MustBeAString })
  @Length(1, 256, { message: ValidationError.MustBeBetweenChars(1, 256) })
  description?: string;
}

export class UpdateCommunityDto {
  @IsString({ message: ValidationError.MustBeAString })
  @Matches(/^[0-9A-Za-z_-]{2,32}$/, {
    message: ValidationError.InvalidCommunityName,
  })
  @Length(2, 32, { message: ValidationError.MustBeBetweenChars(2, 32) })
  name: string;

  @IsOptional()
  @IsString({ message: ValidationError.MustBeAString })
  @Length(1, 256, { message: ValidationError.MustBeBetweenChars(1, 256) })
  description?: string;
}
