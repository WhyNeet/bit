import { Injectable } from "@nestjs/common";
import { CreatePostDto, PostDto } from "src/core/dtos/post.dto";
import { Post } from "src/core/entities/post.entity";
import { CommunityFactoryService } from "../community/community-factory.service";
import { RelationDtoHelper } from "../helpers/relation-dto.helper";
import { UserFactoryService } from "../user/user-factory.service";

@Injectable()
export class PostFactoryService {
	constructor(
		private userFactoryService: UserFactoryService,
		private communityFactoryService: CommunityFactoryService,
	) {}

	// images and files are uploaded in a multipart form
	public createFromDto(
		createPostDto: CreatePostDto,
		authorId: string,
		images: string[],
		files: string[],
	): Post {
		const post = new Post();

		post.title = createPostDto.title;
		post.content = createPostDto.content;
		post.author = authorId;
		post.community = createPostDto.community;
		post.images = images;
		post.files = files;

		return post;
	}

	public createDto(post: Post): PostDto {
		const dto = new PostDto();

		dto.id = post.id;
		dto.title = post.title;
		dto.content = post.content;
		dto.images = post.images;
		dto.files = post.files;
		dto.author = RelationDtoHelper.createFromRelation(
			post.author,
			this.userFactoryService.createDto.bind(this.userFactoryService),
		);
		dto.community = RelationDtoHelper.createFromRelation(
			post.community,
			this.communityFactoryService.createDto.bind(this.communityFactoryService),
		);
		dto.createdAt = post.createdAt;
		dto.updatedAt = post.updatedAt;

		return dto;
	}
}
