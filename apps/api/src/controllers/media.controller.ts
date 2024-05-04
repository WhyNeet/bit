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

@Controller("/media")
export class MediaController {
	constructor(private storageServices: IStorageServices) {}

	@HttpCode(HttpStatus.OK)
	@Get("/file/:fileId")
	public async getFile(@Param("fileId", ParseUUIDPipe) fileId: string) {
		const file = await this.storageServices.getFile(fileId);

		return new StreamableFile(file);
	}
}
