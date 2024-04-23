import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseFilePipeBuilder,
	Post as PostRequest,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import {
	FileFieldsInterceptor,
	FilesInterceptor,
} from "@nestjs/platform-express";
import { CreatePostDto, PostDto } from "src/core/dtos/post.dto";
import { Post } from "src/core/entities/post.entity";
import { ApiResponse } from "src/core/types/response/response.interface";
import { IncludeFields } from "src/features/decorators/includeFields.decorator";
import { PostFactoryService } from "src/features/post/post-factory.service";
import { PostRepositoryService } from "src/features/post/post-repository.service";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/posts")
export class PostController {
	constructor(
		private postRepositoryService: PostRepositoryService,
		private postFactoryService: PostFactoryService,
	) {}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: "images", maxCount: 4 },
			{ name: "attachments", maxCount: 4 },
		]),
	)
	@PostRequest("/create")
	public async createPost(
		@Body() createPostDto: CreatePostDto,
		@UploadedFiles(
			new ParseFilePipeBuilder()
				.addMaxSizeValidator({ maxSize: 3000000 })
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
					fileIsRequired: false,
				}),
		)
		files: {
			images?: Express.Multer.File[];
			attachments?: Express.Multer.File[];
		},
		@Token() token: JwtPayload,
	): ApiResponse<PostDto> {
		if (files.images?.some((f) => !f.mimetype.startsWith("image/")))
			throw new BadRequestException("invalid image filetype");

		const _post = this.postFactoryService.createFromDto(
			createPostDto,
			token.sub,
			files.images
				? files.images.map((f) => `${crypto.randomUUID()}-${f.filename}`)
				: [],
			files.attachments
				? files.attachments.map((f) => `${crypto.randomUUID()}-${f.filename}`)
				: [],
		);

		const post = await this.postRepositoryService.createPost(_post);

		return {
			data: this.postFactoryService.createDto(post),
		};
	}

	@Get("/:postId")
	public async getPostById(
		@Param("postId") postId: string,
		@IncludeFields() includeFields: string[],
	): ApiResponse<PostDto> {
		const post = await this.postRepositoryService.getPostById(
			postId,
			includeFields,
		);

		return {
			data: this.postFactoryService.createDto(post),
		};
	}
}
