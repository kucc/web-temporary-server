import {
  Controller,
  Post,
  Param,
  NotFoundException,
  Req,
  UseGuards,
  Delete,
  NotAcceptableException,
  UnauthorizedException,
  Get,
  Put,
  Body,
} from '@nestjs/common';
import { Request } from 'express';

import { CommentService } from './comment.service';
import { ValidateIdPipe } from '../common/pipe/validate-id.pipe';
import { EditCommentBodyDTO } from './dto/edit-comment-body.dto';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { CreateCommentBodyDTO } from './dto/create-comment-body.dto';
import { GetCommentResponseDTO } from './dto/get-comment-response.dto';
import { CommentLikeService } from '../comment-like/comment-like.service';
import { CommentReplyService } from '../comment-reply/comment-reply.service';

@Controller('comment')
export class CommentController {
  public constructor(
    private readonly commentService: CommentService,
    private readonly commentLikeService: CommentLikeService,
    private readonly commentReplyService: CommentReplyService,
  ) {}

  @Put(':Id')
  @UseGuards(OnlyMemberGuard)
  async editComment(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() editCommentBodyDTO: EditCommentBodyDTO,
    @Req() request: Request,
  ): Promise<GetCommentResponseDTO> {
    const Comment = await this.commentService.findCommentById(Id);

    if (!Comment) {
      throw new NotFoundException(`${Id}번 Comment가 존재하지 않습니다.`);
    }

    if (!Comment.status) {
      throw new NotFoundException('삭제된 Comment입니다.');
    }

    if (Comment.userId !== request.user.Id) {
      throw new NotAcceptableException('유효하지 않은 접근입니다.');
    }

    const newComment = await this.commentService.editComment(
      Comment,
      editCommentBodyDTO,
    );

    return new GetCommentResponseDTO(newComment);
  }

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
      throw new UnauthorizedException('유효하지 않은 접근입니다.');
    }

    try {
      this.commentService.deleteComment(Id);
    } catch (e) {
      return { result: false };
    }

    return { result: true };
  }

  @Get(':Id/like')
  @UseGuards(OnlyMemberGuard)
  async getLikeOfUser(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() request: Request,
  ): Promise<boolean> {
    const Comment = await this.commentService.findCommentById(Id);

    if (!Comment) {
      throw new NotFoundException(`${Id}번 Comment가 존재하지 않습니다.`);
    }

    if (!Comment.status) {
      throw new NotFoundException('삭제된 Comment입니다.');
    }

    const IsLiked = await this.commentLikeService.findEntity(
      Comment.Id,
      request.user.Id,
    );

    return IsLiked;
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
      throw new NotAcceptableException('삭제된 Comment입니다.');
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

  @Post(':Id/reply')
  @UseGuards(OnlyMemberGuard)
  async createReply(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() createCommentBodyDTO: CreateCommentBodyDTO,
    @Req() request: Request,
  ): Promise<GetCommentResponseDTO> {
    const Comment = await this.commentService.findCommentById(Id);

    if (!Comment) {
      throw new NotFoundException(`${Id}번 Comment가 존재하지 않습니다.`);
    }

    if (!Comment.status) {
      throw new NotFoundException('삭제된 Comment입니다.');
    }

    const userId = request.user.Id;
    const postId = Comment.postId;
    const isReply = true;

    const Reply = await this.commentService.createComment(
      postId,
      userId,
      createCommentBodyDTO,
      isReply,
    );

    this.commentReplyService.addParentChildRelation(Id, Reply.Id);

    return new GetCommentResponseDTO(Reply);
  }
}
