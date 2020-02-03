import {
  Controller,
  Delete,
  UseGuards,
  Param,
  Req,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { Request } from 'express';

import { CommentService } from './comment.service';
import { ValidateIdPipe } from '../common/pipe/validate-id.pipe';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';

@Controller('comment')
export class CommentController {
  public constructor(private readonly commentService: CommentService) {}

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
}
