import { NoSuchKey } from "@aws-sdk/client-s3";
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	StreamableFile,
} from "@nestjs/common";
import { IStorageServices } from "src/core/abstracts/storage-services.abstract";
import { MediaException } from "src/features/exception-handling/exceptions/media.exception";

@Controller("/media")
export class MediaController {
	constructor(private storageServices: IStorageServices) {}

	@HttpCode(HttpStatus.OK)
	@Get("/file/:fileId")
	public async getFile(@Param("fileId", ParseUUIDPipe) fileId: string) {
		try {
			const file = await this.storageServices.getFile(fileId);

			return new StreamableFile(file);
		} catch (e) {
			if (e instanceof NoSuchKey) throw new MediaException.FileDoesNotExist();
			throw e;
		}
	}
}
