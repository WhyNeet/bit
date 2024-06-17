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
import { UserPostRelationType } from "common";
import { ApiResponse, Community, PostDto, PostVectorData } from "common";
import { Schema } from "mongoose";
import { FormDataRequest } from "nestjs-form-data";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { IStorageServices } from "src/core/abstracts/storage-services.abstract";
import { IVectorEmbeddingServices } from "src/core/abstracts/vector-embedding-services.abstract";
import { IVectorStorageServices } from "src/core/abstracts/vector-storage-services.abstract";
import {
	CreatePostDto,
	PostsSearchQueryDto,
	UpdatePostDto,
} from "src/core/dtos/post.dto";
import { CommunityRepositoryService } from "src/features/community/community-repository.service";
import { IncludeFields } from "src/features/decorators/includeFields.decorator";
import { PageData } from "src/features/decorators/pagination/page-data.interface";
import { Pagination } from "src/features/decorators/pagination/pagination.decorator";
import { CommunityException } from "src/features/exception-handling/exceptions/community.exception";
import { PostException } from "src/features/exception-handling/exceptions/post.exception";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
import { PostFactoryService } from "src/features/post/post-factory.service";
import { PostRepositoryService } from "src/features/post/post-repository.service";
import { RelationHelperService } from "src/features/relation/relation-helper.service";
import { UserRepositoryService } from "src/features/user/user-repository.service";
import { VectorFactoryService } from "src/features/vector/vector-factory.service";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { OptionalJwtAuthGuard } from "src/frameworks/auth/guards/optional-jwt.guard";
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
		private relationHelperService: RelationHelperService,
		private userRepositoryService: UserRepositoryService,
	) {}

	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard)
	@FormDataRequest()
	@PostRequest("/create")
	public async createPost(
		@Body() createPostDto: CreatePostDto,
		@Token() payload: JwtPayload,
	): ApiResponse<PostDto> {
		if (createPostDto.community) {
			const community = await this.communityRepositoryService.getCommunityById(
				createPostDto.community,
				[],
				"_id",
			);
			if (!community) throw new CommunityException.CommunityDoesNotExist();
		}

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
					post.community?.toString(),
				),
			],
		);

		return {
			data: this.postFactoryService.createDto(post),
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
		@Query() postsSearchQueryDto: PostsSearchQueryDto,
		@IncludeFields() includeFields: string[],
	): ApiResponse<PostVectorData[]> {
		const queryVector = await this.vectorEmbeddingServices.createEmbedding(
			postsSearchQueryDto.query,
		);
		const results = (
			await this.vectorStorageServices.searchVectorData<PostVectorData>(
				"POSTS_EMBEDDINGS",
				queryVector,
				10,
			)
		).map((res) => ({
			...res,
			community: res.community === "undefined" ? undefined : res.community,
		}));

		const includeAuthor = includeFields.includes("author");
		const includeCommunity = includeFields.includes("community");

		if (includeAuthor)
			await this.relationHelperService.replaceIdField(
				results,
				"author",
				(ids, limit) => this.userRepositoryService.getUsersById(ids, limit),
			);
		if (includeCommunity)
			await this.relationHelperService.replaceIdField(
				results,
				"community",
				(ids, limit) =>
					this.communityRepositoryService.getCommunities(ids, limit),
			);

		return {
			data: results.map(
				this.vectorFactoryService.createPostVectorDataDto.bind(
					this.vectorFactoryService,
				),
			),
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(OptionalJwtAuthGuard)
	@Get("/latest")
	public async getLatestPosts(
		@IncludeFields() includeFields: string[],
		@Pagination() pageData: PageData,
		@Token() payload?: JwtPayload,
	): ApiResponse<PostDto[]> {
		const posts = await this.postRepositoryService.getLatestPosts(
			pageData.page ?? 0,
			pageData.perPage ?? 20,
			undefined,
			includeFields,
		);

		const dto: PostDto[] = posts.map(
			this.postFactoryService.createDto.bind(this.postFactoryService),
		);

		if (payload) await this.postRepositoryService.setIsLiked(dto, payload.sub);

		return {
			data: dto,
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Get("/home")
	public async getHomePosts(
		@IncludeFields() includeFields: string[],
		@Token() payload: JwtPayload,
		@Pagination() pageData: PageData,
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
			pageData.page ?? 0,
			pageData.perPage ?? 20,
			allowedCommunities,
			includeFields,
		);

		if (!cachedAllowedCommunities.length && allowedCommunities.length)
			await this.cachingServices.sadd(
				`userCommunities:${payload.sub}`,
				allowedCommunities,
			);

		const dto: PostDto[] = posts.map(
			this.postFactoryService.createDto.bind(this.postFactoryService),
		);

		if (payload) await this.postRepositoryService.setIsLiked(dto, payload.sub);

		return {
			data: dto,
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(OptionalJwtAuthGuard)
	@Get("/:postId")
	public async getPostById(
		@Param("postId", ParseObjectIdPipe.stringified()) postId: string,
		@IncludeFields() includeFields: string[],
		@Token() payload?: JwtPayload,
	): ApiResponse<PostDto> {
		const post = await this.postRepositoryService.getPostById(
			postId,
			includeFields,
		);

		if (!post) throw new PostException.PostDoesNotExist();

		const dto = this.postFactoryService.createDto(post);

		if (payload) {
			const postId = dto.id;
			const userId = payload.sub;

			const relationType =
				await this.postRepositoryService.getUserPostRelationType(
					postId,
					userId,
				);
			const isLiked = relationType
				? relationType === UserPostRelationType.Upvote
				: undefined;
			dto.isLiked = isLiked;
		}

		return {
			data: dto,
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
