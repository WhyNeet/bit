import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse } from "common";
import { CommentDto } from "common";
import { CreateCommentDto, UpdateCommentDto } from "src/core/dtos/comment.dto";
import { CommentFactoryService } from "src/features/comment/comment-factory.service";
import { CommentRepositoryService } from "src/features/comment/comment-repository.service";
import { CommentException } from "src/features/exception-handling/exceptions/comment.exception";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/comments")
export class CommentController {
  constructor(
    private commentRespositoryService: CommentRepositoryService,
    private commentFactoryService: CommentFactoryService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post("")
  public async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Token() payload: JwtPayload,
  ): ApiResponse<CommentDto> {
    const comment = await this.commentRespositoryService.createComment(
      this.commentFactoryService.createFromDto(createCommentDto, payload.sub),
    );

    return {
      data: this.commentFactoryService.createDto(comment),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get("/post/:postId")
  public async getPostComments(
    @Param("postId", ParseObjectIdPipe.stringified()) postId: string,
  ): ApiResponse<CommentDto[]> {
    const comments =
      await this.commentRespositoryService.getPostComments(postId);

    return {
      data: comments.map(
        this.commentFactoryService.createDto.bind(this.commentFactoryService),
      ),
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch("/:commentId")
  public async updateComment(
    @Param("commentId", ParseObjectIdPipe.stringified()) commentId: string,
    @Token() payload: JwtPayload,
    @Body() updateCommentDto: UpdateCommentDto,
  ): ApiResponse<CommentDto> {
    const isValidOwner =
      await this.commentRespositoryService.verifyCommentOwner(
        commentId,
        payload.sub,
      );
    if (!isValidOwner) throw new CommentException.CommentCannotBeModified();

    const comment = await this.commentRespositoryService.updateComment(
      commentId,
      updateCommentDto.content,
    );

    return {
      data: this.commentFactoryService.createDto(comment),
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete("/:commentId")
  public async deleteComment(
    @Param("commentId", ParseObjectIdPipe.stringified()) commentId: string,
    @Token() payload: JwtPayload,
  ): ApiResponse<null> {
    const isValidOwner =
      await this.commentRespositoryService.verifyCommentOwner(
        commentId,
        payload.sub,
      );
    if (!isValidOwner) throw new CommentException.CommentCannotBeModified();

    await this.commentRespositoryService.deleteComment(commentId);

    return {
      data: null,
    };
  }
}
