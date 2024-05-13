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
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiResponse, Community, PostDto, PostVectorData } from "common";
import { FormDataRequest } from "nestjs-form-data";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { IStorageServices } from "src/core/abstracts/storage-services.abstract";
import { IVectorEmbeddingServices } from "src/core/abstracts/vector-embedding-services.abstract";
import { IVectorStorageServices } from "src/core/abstracts/vector-storage-services.abstract";
import { CreatePostDto, UpdatePostDto } from "src/core/dtos/post.dto";
import { CommunityRepositoryService } from "src/features/community/community-repository.service";
import { IncludeFields } from "src/features/decorators/includeFields.decorator";
import { CommunityException } from "src/features/exception-handling/exceptions/community.exception";
import { PostException } from "src/features/exception-handling/exceptions/post.exception";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
import { PostFactoryService } from "src/features/post/post-factory.service";
import { PostRepositoryService } from "src/features/post/post-repository.service";
import { VectorFactoryService } from "src/features/vector/vector-factory.service";
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
		private vectorEmbeddingServices: IVectorEmbeddingServices,
		private vectorStorageServices: IVectorStorageServices,
		private vectorFactoryService: VectorFactoryService,
		private cachingServices: ICachingServices,
	) {}

	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard)
	@FormDataRequest()
	@PostRequest("/create")
	public async createPost(
		@Body() createPostDto: CreatePostDto,
		@Token() payload: JwtPayload,
	): ApiResponse<PostDto> {
		const community = await this.communityRepositoryService.getCommunityById(
			createPostDto.community,
			[],
			"_id",
		);
		if (!community) throw new CommunityException.CommunityDoesNotExist();

		const images = (createPostDto.images ?? []).map((f) => ({
			body: f.buffer,
			fileName: `post/${crypto.randomUUID()}`,
		}));
		const files = (createPostDto.files ?? []).map((f) => ({
			body: f.buffer,
			fileName: `post/${crypto.randomUUID()}`,
		}));

		for (const image of images)
			await this.storageServices.putFile(image.fileName, image.body);
		for (const file of files)
			await this.storageServices.putFile(file.fileName, file.body);

		const _post = this.postFactoryService.createFromDto(
			createPostDto,
			payload.sub,
			images.map((f) => f.fileName),
			files.map((f) => f.fileName),
		);

		const post = await this.postRepositoryService.createPost(_post);
		const titleVector = await this.vectorEmbeddingServices.createEmbedding(
			post.title,
		);
		await this.vectorStorageServices.insertVectorData<PostVectorData>(
			"POSTS_EMBEDDINGS",
			[
				this.vectorFactoryService.createPostEmbeddingVector(
					post.id,
					post.title,
					titleVector,
					payload.sub,
					post.community.toString(),
				),
			],
		);

		return {
			data: this.postFactoryService.createDto(post, payload.sub),
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@PostRequest("/:postId/upvote")
	public async likePost(
		@Param("postId", ParseObjectIdPipe.stringified()) postId: string,
		@Token() payload: JwtPayload,
	): ApiResponse<null> {
		await this.postRepositoryService.upvotePost(postId, payload.sub);

		return {
			data: null,
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Delete("/:postId/upvote")
	public async removePostLike(
		@Param("postId", ParseObjectIdPipe.stringified()) postId: string,
		@Token() payload: JwtPayload,
	): ApiResponse<null> {
		await this.postRepositoryService.removePostUpvote(postId, payload.sub);

		return {
			data: null,
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@PostRequest("/:postId/downvote")
	public async dislikePost(
		@Param("postId", ParseObjectIdPipe.stringified()) postId: string,
		@Token() payload: JwtPayload,
	): ApiResponse<null> {
		await this.postRepositoryService.downvotePost(postId, payload.sub);

		return {
			data: null,
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Delete("/:postId/downvote")
	public async removePostDislike(
		@Param("postId", ParseObjectIdPipe.stringified()) postId: string,
		@Token() payload: JwtPayload,
	): ApiResponse<null> {
		await this.postRepositoryService.removePostDownvote(postId, payload.sub);

		return {
			data: null,
		};
	}

	@HttpCode(HttpStatus.OK)
	@Get("/search")
	public async searchPosts(
		@Query("q") query: string,
	): ApiResponse<PostVectorData[]> {
		const queryVector =
			await this.vectorEmbeddingServices.createEmbedding(query);
		const results =
			await this.vectorStorageServices.searchVectorData<PostVectorData>(
				"POSTS_EMBEDDINGS",
				queryVector,
				10,
			);

		return {
			data: results,
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
		const cachedAllowedCommunities = await this.cachingServices.sget<string>(
			`userCommunities:${payload.sub}`,
		);

		const allowedCommunities =
			cachedAllowedCommunities.length > 0
				? cachedAllowedCommunities
				: (
						await this.communityRepositoryService.getUserCommunities(
							payload.sub,
						)
					).map((c) => c.community.toString());

		const posts = await this.postRepositoryService.getLatestPosts(
			allowedCommunities,
			includeFields,
		);

		if (!cachedAllowedCommunities.length && allowedCommunities.length)
			await this.cachingServices.sadd(
				`userCommunities:${payload.sub}`,
				allowedCommunities,
			);

		return {
			data: posts.map((post) =>
				this.postFactoryService.createDto(post, payload.sub),
			),
		};
	}

	@HttpCode(HttpStatus.OK)
	@Get("/:postId")
	public async getPostById(
		@Param("postId", ParseObjectIdPipe.stringified()) postId: string,
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

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@FormDataRequest()
	@Patch("/:postId")
	public async updatePost(
		@Param("postId", ParseObjectIdPipe.stringified()) postId: string,
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

		const titleVector = await this.vectorEmbeddingServices.createEmbedding(
			updatePostDto.title,
		);

		await this.vectorStorageServices.updateVectorData<PostVectorData>(
			"POSTS_EMBEDDINGS",
			[
				this.vectorFactoryService.createPostEmbeddingVector(
					post.id,
					post.title,
					titleVector,
					token.sub,
					post.community.toString(),
				),
			],
		);

		return {
			data: this.postFactoryService.createDto(updatedPost),
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Delete("/:postId")
	public async deletePost(
		@Param("postId", ParseObjectIdPipe.stringified()) postId: string,
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

		await this.vectorStorageServices.deleteVectorData("POSTS_EMBEDDINGS", [
			post.id,
		]);

		return {
			data: null,
		};
	}
}
