import { NoSuchKey } from "@aws-sdk/client-s3";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiResponse } from "common";
import { IStorageServices } from "src/core/abstracts/storage-services.abstract";
import { CommunityRepositoryService } from "src/features/community/community-repository.service";
import { CommunityException } from "src/features/exception-handling/exceptions/community.exception";
import { MediaException } from "src/features/exception-handling/exceptions/media.exception";
import { ParseFileIdPipe } from "src/features/pipes/parse-fileid.pipe";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/media")
export class MediaController {
  constructor(
    private storageServices: IStorageServices,
    private communityRepositoryService: CommunityRepositoryService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get("/post/:fileId")
  public async getFile(
    @Param("fileId", ParseFileIdPipe) fileId: string,
  ): Promise<StreamableFile> {
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
  ): Promise<StreamableFile> {
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
  @UseInterceptors(FileInterceptor("file"))
  @Post("/avatar")
  public async setUserAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: "image/*" })
        .build(),
    )
    file: Express.Multer.File,
    @Token() payload: JwtPayload,
  ): ApiResponse<null> {
    const fileName = `avatar/${payload.sub}`;

    await this.storageServices.putFile(fileName, file.buffer);

    return {
      data: null,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("/avatar")
  public async getCurrentUserAvatar(
    @Token() payload: JwtPayload,
  ): Promise<StreamableFile> {
    try {
      const file = await this.storageServices.getFile(`avatar/${payload.sub}`);

      return new StreamableFile(file);
    } catch (e) {
      if (e instanceof NoSuchKey) throw new MediaException.FileDoesNotExist();
      throw e;
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Post("/community/:communityId/icon")
  public async setCommunityIcon(
    @Token() payload: JwtPayload,
    @Param("communityId", ParseObjectIdPipe.stringified()) communityId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: "image/*" })
        .build(),
    )
    file: Express.Multer.File,
  ): ApiResponse<null> {
    const community =
      await this.communityRepositoryService.getCommunityById(communityId);

    if (community.owner.toString() !== payload.sub)
      throw new CommunityException.CommunityCannotBeModified();

    await this.storageServices.putFile(
      `community-icon/${community.id}`,
      file.buffer,
    );

    return {
      data: null,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get("/community/:communityId/icon")
  public async getCommunityIcon(
    @Param("communityId", ParseObjectIdPipe.stringified()) communityId: string,
  ): Promise<StreamableFile> {
    try {
      const file = await this.storageServices.getFile(
        `community-icon/${communityId}`,
      );

      return new StreamableFile(file);
    } catch (e) {
      if (e instanceof NoSuchKey) throw new MediaException.FileDoesNotExist();
      throw e;
    }
  }
}
