import { Injectable } from "@nestjs/common";
import { Comment } from "common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { CommentFactoryService } from "./comment-factory.service";

@Injectable()
export class CommentRepositoryService {
  constructor(
    private commentFactoryService: CommentFactoryService,
    private dataServices: IDataServices,
  ) {}

  public async createComment(comment: Comment): Promise<Comment> {
    return await this.dataServices.comments.create(comment);
  }

  public async getPostComments(
    postId: string,
    include: string[],
    page = 0,
    perPage = 20,
  ): Promise<Comment[]> {
    return await this.dataServices.comments.getAll(
      { post: postId },
      { createdAt: "desc" },
      perPage,
      page * perPage,
      include,
    );
  }

  public async updateComment(
    commentId: string,
    content: string,
  ): Promise<Comment> {
    return await this.dataServices.comments.update(
      { _id: commentId },
      this.commentFactoryService.createWithContent(content),
    );
  }

  public async deleteComment(commentId: string): Promise<Comment> {
    return await this.dataServices.comments.delete({ _id: commentId });
  }

  public async verifyCommentOwner(
    commentId: string,
    userId: string,
  ): Promise<boolean> {
    return (
      (
        await this.dataServices.comments.get({ _id: commentId })
      ).author.toString() === userId
    );
  }
}
