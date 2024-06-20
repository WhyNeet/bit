import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";
import { isValidObjectId } from "mongoose";

export function IsObjectId(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "isObjectId",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          return typeof value === "string" && isValidObjectId(value);
        },
      },
    });
  };
}
