import { HttpException, HttpStatus } from "@nestjs/common";

export class CommonHttpException extends HttpException {
	constructor(
		type: string,
		title: string,
		detail: string | object,
		status: HttpStatus,
	) {
		super({ type, title, detail }, status);
	}

	public getResponseError(): object {
		return this.getResponse() as object;
	}
}
