import { HttpException, HttpStatus, ValidationError } from "@nestjs/common";
import { CommonHttpException } from "src/frameworks/exception-handling/common/common-http.exception";

// biome-ignore lint/complexity/noStaticOnlyClass: grouping
export class ValidationExceptionFactory {
  public static transform(errors: ValidationError[]): HttpException {
    const exception = new CommonHttpException(
      "Validation/ValidationFailed",
      "Validation failed.",
      ValidationExceptionFactory.transformErrors(errors),
      HttpStatus.BAD_REQUEST,
    );

    return exception;
  }

  private static transformErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      const { property, constraints, children } = error;

      const exception = {
        constrains: [
          ...Object.values(constraints ?? {}),
          ...(acc[property] ?? []),
        ],
        children: {
          ...(children
            ? ValidationExceptionFactory.transformErrors(children)
            : {}),
        },
      };

      acc[property] = exception;

      return acc;
    }, {});
  }
}
