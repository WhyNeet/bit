import { ArgumentMetadata, HttpStatus, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";
import { CommonHttpException } from "src/frameworks/exception-handling/common/common-http.exception";

export class ParseObjectIdPipe implements PipeTransform {
	constructor(private stringify = false) {}

	public static stringified(): ParseObjectIdPipe {
		return new ParseObjectIdPipe(true);
	}

	public transform(value: string, _: ArgumentMetadata) {
		try {
			return this.stringify
				? new Types.ObjectId(value).toString()
				: new Types.ObjectId(value);
		} catch (e) {
			throw new CommonHttpException(
				"Validation/ValidationFailed",
				"Invalid identifier provided.",
				"Please, provide a valid identifier.",
				HttpStatus.BAD_REQUEST,
			);
		}
	}
}
