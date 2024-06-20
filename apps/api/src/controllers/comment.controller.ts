import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse } from "common";
import { CommentDto } from "common";
import { CreateCommentDto } from "src/core/dtos/comment.dto";
import { CommentFactoryService } from "src/features/comment/comment-factory.service";
import { CommentRepositoryService } from "src/features/comment/comment-repository.service";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/comments")
export class CommentController {
  constructor(
    private commentRespositoryService: CommentRepositoryService,
    private commentFactoryService: CommentFactoryService,
  ) {}

  @HttpCode(HttpStatus.OK)
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
}
