import { HttpStatus } from "@nestjs/common";
import { CommonHttpException } from "../common/common-http.exception";

export function CommonException(
	title: string,
	detail: string,
	statusCode: HttpStatus,
	customType?: string,
) {
	return <T extends abstract new (...args: unknown[]) => object>(
		target: T,
		propertyKey: string,
	) => {
		class Exception extends CommonHttpException {
			constructor(customDetail?: string) {
				super(
					customType ?? `${target.name}/${propertyKey}`,
					title,
					customDetail ?? detail,
					statusCode,
				);
			}
		}

		target[propertyKey] = Exception;
	};
}
