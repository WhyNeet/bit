import { Injectable } from "@nestjs/common";
import { Post, PostDto } from "common";
import { CreatePostDto, UpdatePostDto } from "src/core/dtos/post.dto";
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
    post.upvotes = 0;
    post.downvotes = 0;

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
    dto.community = post.community
      ? RelationDtoHelper.createFromRelation(
          post.community,
          this.communityFactoryService.createDto.bind(
            this.communityFactoryService,
          ),
        )
      : undefined;
    dto.upvotes = post.upvotes;
    dto.downvotes = post.downvotes;
    dto.createdAt = post.createdAt;
    dto.updatedAt = post.updatedAt;

    return dto;
  }

  public createFromUpdateDto(
    updatePostDto: UpdatePostDto,
    images: string[],
    files: string[],
  ): Post {
    const post = new Post();

    post.title = updatePostDto.title;
    post.content = updatePostDto.content;
    post.images = images;
    post.files = files;

    return post;
  }

  public updatePost(
    post: Post,
    updatePostDto: UpdatePostDto,
    images: string[],
    files: string[],
  ): Post {
    post.title = updatePostDto.title;
    post.content = updatePostDto.content;
    post.images = images;
    post.files = files;

    return post;
  }

  public createPostFileId(originalName: string): string {
    const fileext = (originalName.split(".").at(-1) ?? "").slice(0, 10);
    // filename must not contain any extensions and must be at most 18 characters long
    const filename = originalName.slice(
      0,
      Math.min(originalName.length - fileext.length - 1, 18),
    );

    return `post/${crypto.randomUUID()}${
      filename.length
    }.${filename}${fileext}`;
  }
}
