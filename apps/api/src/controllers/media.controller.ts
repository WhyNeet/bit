import { NoSuchKey } from "@aws-sdk/client-s3";
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	StreamableFile,
	UseGuards,
} from "@nestjs/common";
import { IStorageServices } from "src/core/abstracts/storage-services.abstract";
import { MediaException } from "src/features/exception-handling/exceptions/media.exception";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/media")
export class MediaController {
	constructor(private storageServices: IStorageServices) {}

	@HttpCode(HttpStatus.OK)
	@Get("/post/:fileId")
	public async getFile(@Param("fileId", ParseUUIDPipe) fileId: string) {
		try {
			const file = await this.storageServices.getFile(`post/${fileId}`);

			return new StreamableFile(file);
		} catch (e) {
			if (e instanceof NoSuchKey) throw new MediaException.FileDoesNotExist();
			throw e;
		}
	}

	@HttpCode(HttpStatus.OK)
	@Get("/avatar/:userId")
	public async getAvatar(
		@Param("userId", ParseObjectIdPipe.stringified()) userId: string,
	) {
		try {
			const file = await this.storageServices.getFile(`avatar/${userId}`);

			return new StreamableFile(file);
		} catch (e) {
			if (e instanceof NoSuchKey) throw new MediaException.FileDoesNotExist();
			throw e;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Get("/avatar")
	public async getCurrentUserAvatar(@Token() payload: JwtPayload) {
		try {
			const file = await this.storageServices.getFile(`avatar/${payload.sub}`);

			return new StreamableFile(file);
		} catch (e) {
			if (e instanceof NoSuchKey) throw new MediaException.FileDoesNotExist();
			throw e;
		}
	}
}
