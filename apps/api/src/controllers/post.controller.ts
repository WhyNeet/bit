import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post as PostRequest,
	UseGuards,
} from "@nestjs/common";
import { FormDataRequest } from "nestjs-form-data";
import { IStorageServices } from "src/core/abstracts/storage-services.abstract";
import { CreatePostDto, PostDto, UpdatePostDto } from "src/core/dtos/post.dto";
import { Community } from "src/core/entities/community.entity";
import { ApiResponse } from "src/core/types/response/response.interface";
import { CommunityRepositoryService } from "src/features/community/community-repository.service";
import { IncludeFields } from "src/features/decorators/includeFields.decorator";
import { CommunityException } from "src/features/exception-handling/exceptions/community.exception";
import { PostException } from "src/features/exception-handling/exceptions/post.exception";
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
		private storageServices: IStorageServices,
		private communityRepositoryService: CommunityRepositoryService,
	) {}

	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard)
	@FormDataRequest()
	@PostRequest("/create")
	public async createPost(
		@Body() createPostDto: CreatePostDto,
		@Token() token: JwtPayload,
	): ApiResponse<PostDto> {
		const community = await this.communityRepositoryService.getCommunityById(
			createPostDto.community,
			[],
			"_id",
		);
		if (!community) throw new CommunityException.CommunityDoesNotExist();

		const images = (createPostDto.images ?? []).map((f) => ({
			body: f.buffer,
			fileName: crypto.randomUUID(),
		}));
		const files = (createPostDto.files ?? []).map((f) => ({
			body: f.buffer,
			fileName: crypto.randomUUID(),
		}));

		for (const image of images)
			await this.storageServices.putFile(image.fileName, image.body);
		for (const file of files)
			await this.storageServices.putFile(file.fileName, file.body);

		const _post = this.postFactoryService.createFromDto(
			createPostDto,
			token.sub,
			images.map((f) => f.fileName),
			files.map((f) => f.fileName),
		);

		const post = await this.postRepositoryService.createPost(_post);

		return {
			data: this.postFactoryService.createDto(post),
		};
	}

	@HttpCode(HttpStatus.OK)
	@Get("/latest")
	public async getLatestPosts(
		@IncludeFields() includeFields: string[],
	): ApiResponse<PostDto[]> {
		const posts = await this.postRepositoryService.getLatestPosts(
			undefined,
			includeFields,
		);

		return {
			data: posts.map(
				this.postFactoryService.createDto.bind(this.postFactoryService),
			),
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Get("/home")
	public async getHomePosts(
		@IncludeFields() includeFields: string[],
		@Token() payload: JwtPayload,
	): ApiResponse<PostDto[]> {
		const allowedCommunities =
			await this.communityRepositoryService.getUserCommunities(payload.sub);

		const posts = await this.postRepositoryService.getLatestPosts(
			allowedCommunities.map((c) => c.community.toString()),
			includeFields,
		);

		return {
			data: posts.map(
				this.postFactoryService.createDto.bind(this.postFactoryService),
			),
		};
	}

	@HttpCode(HttpStatus.OK)
	@Get("/:postId")
	public async getPostById(
		@Param("postId") postId: string,
		@IncludeFields() includeFields: string[],
	): ApiResponse<PostDto> {
		const post = await this.postRepositoryService.getPostById(
			postId,
			includeFields,
		);

		if (!post) throw new PostException.PostDoesNotExist();

		return {
			data: this.postFactoryService.createDto(post),
		};
	}

	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard)
	@FormDataRequest()
	@Patch("/:postId")
	public async updatePost(
		@Param("postId") postId: string,
		@Body() updatePostDto: UpdatePostDto,
		@Token() token: JwtPayload,
	): ApiResponse<PostDto> {
		const oldPost = await this.postRepositoryService.getPostById(postId);

		if (!oldPost) throw new PostException.PostDoesNotExist();
		if (oldPost.author.toString() !== token.sub)
			throw new PostException.PostCannotBeModified();

		await this.storageServices.deleteFiles(oldPost.images);
		await this.storageServices.deleteFiles(oldPost.files);

		const images = (updatePostDto.images ?? []).map((f) => ({
			body: f.buffer,
			fileName: crypto.randomUUID(),
		}));
		const files = (updatePostDto.files ?? []).map((f) => ({
			body: f.buffer,
			fileName: crypto.randomUUID(),
		}));

		for (const image of images)
			await this.storageServices.putFile(image.fileName, image.body);
		for (const file of files)
			await this.storageServices.putFile(file.fileName, file.body);

		const post = await this.postRepositoryService.updatePost(
			postId,
			updatePostDto,
			images.map((f) => f.fileName),
			files.map((f) => f.fileName),
		);

		const updatedPost = this.postFactoryService.updatePost(
			post,
			updatePostDto,
			images.map((f) => f.fileName),
			files.map((f) => f.fileName),
		);

		return {
			data: this.postFactoryService.createDto(updatedPost),
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Delete("/:postId")
	public async deletePost(
		@Param("postId") postId: string,
		@Token() payload: JwtPayload,
	): ApiResponse<null> {
		const post = await this.postRepositoryService.getPostById(
			postId,
			["community"],
			"author commmunity images files",
		);

		if (!post) throw new PostException.PostDoesNotExist();

		if (
			post.author.toString() !== payload.sub &&
			(post.community as Community).owner.toString() !== payload.sub
		)
			throw new PostException.PostCannotBeModified();

		await this.postRepositoryService.deletePost(postId);

		await this.storageServices.deleteFiles(post.images);
		await this.storageServices.deleteFiles(post.files);

		return {
			data: null,
		};
	}
}
