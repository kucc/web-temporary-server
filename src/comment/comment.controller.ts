import {
  Controller,
  Post,
  Param,
  NotFoundException,
  Req,
  UseGuards,
  Delete,
  NotAcceptableException,
} from '@nestjs/common';
import { Request } from 'express';

import { CommentService } from './comment.service';
import { ValidateIdPipe } from '../common/pipe/validate-id.pipe';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { CommentLikeService } from '../comment-like/comment-like.service';

@Controller('comment')
export class CommentController {
  public constructor(
    private readonly commentService: CommentService,
    private readonly commentLikeService: CommentLikeService,
  ) {}

  @Delete(':Id')
  @UseGuards(OnlyMemberGuard)
  async deleteComment(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() request: Request,
  ) {
    const Comment = await this.commentService.findCommentById(Id);

    if (!Comment) {
      throw new NotFoundException(`${Id}번 Comment가 존재하지 않습니다.`);
    }

    if (Comment.userId !== request.user.Id) {
      throw new NotAcceptableException('당신이 쓴 댓글이 아니다!!!!!');
    }

    try {
      this.commentService.deleteComment(Id);
    } catch (e) {
      return { result: false };
    }

    return { result: true };
  }

  @Post(':Id/like')
  @UseGuards(OnlyMemberGuard)
  async updateLikes(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() request: Request,
  ) {
    const Comment = await this.commentService.findCommentById(Id);

    if (!Comment) {
      throw new NotFoundException(`${Id}번 Comment가 존재하지 않습니다.`);
    }

    if (!Comment.status) {
      throw new NotFoundException('삭제된 Comment입니다.');
    }

    const toggleResult = await this.commentLikeService.toggleLikes(
      Id,
      request.user.Id,
    );

    try {
      toggleResult
        ? this.commentService.incrementLikes(Id)
        : this.commentService.decrementLikes(Id);
    } catch (e) {
      return { return: false };
    }

    return { return: true };
  }
}
