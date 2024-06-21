import { Injectable } from "@nestjs/common";
import { Comment, CreateCommentDto } from "common";
import { CommentDto } from "common";
import { Types } from "mongoose";
import { RelationDtoHelper } from "../helpers/relation-dto.helper";
import { PostFactoryService } from "../post/post-factory.service";
import { UserFactoryService } from "../user/user-factory.service";

@Injectable()
export class CommentFactoryService {
  constructor(
    private userFactoryService: UserFactoryService,
    private postFactoryService: PostFactoryService,
  ) {}

  public createFromDto(
    createCommentDto: CreateCommentDto,
    authorId: string,
  ): Comment {
    const comment = new Comment();

    comment.content = createCommentDto.content;
    comment.post = createCommentDto.post;
    comment.author = authorId;

    return comment;
  }

  public createDto(comment: Comment): CommentDto {
    const dto = new CommentDto();

    dto.id = comment.id;
    dto.content = comment.content;
    dto.author = RelationDtoHelper.createFromRelation(
      comment.author,
      this.userFactoryService.createDto.bind(this.userFactoryService),
    );
    dto.post = RelationDtoHelper.createFromRelation(
      comment.post,
      this.postFactoryService.createDto.bind(this.postFactoryService),
    );
    dto.createdAt = comment.createdAt;
    dto.updatedAt = comment.updatedAt;

    return dto;
  }

  public createWithContent(content: string): Comment {
    const comment = new Comment();

    comment.content = content;

    return comment;
  }
}
