import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  NotFoundException,
  Req,
  UseGuards,
  Delete,
  NotAcceptableException,
  Put,
} from '@nestjs/common';
import { Request } from 'express';

import { PostService } from './post.service';
import { EditPostBodyDTO } from './dto/edit-post-body.dto';
import { CommentService } from '../comment/comment.service';
import { CreatePostBodyDTO } from './dto/create-post-body.dto';
import { ValidateIdPipe } from '../common/pipe/validate-id.pipe';
import { GetPostResponseDTO } from './dto/get-post-response.dto';
import { PostLikeService } from '../post-like/post-like.service';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { CreateCommentBodyDTO } from '../comment/dto/create-comment-body.dto';
import { GetCommentResponseDTO } from '../comment/dto/get-comment-response.dto';

@Controller('post')
export class PostController {
  public constructor(
    private readonly postService: PostService,
    private readonly postLikeService: PostLikeService,
    private readonly commentService: CommentService,
  ) {}

  @Get(':Id')
  async getPostById(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<GetPostResponseDTO> {
    const Post = await this.postService.findPostById(Id);

    if (!Post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    return new GetPostResponseDTO(Post);
  }

  @Post('')
  @UseGuards(OnlyMemberGuard)
  async createPost(
    @Body() createPostBodyDTO: CreatePostBodyDTO,
    @Req() request: Request,
  ): Promise<GetPostResponseDTO> {
    const userId = request.user.Id;
    const Post = await this.postService.createPost(userId, createPostBodyDTO);
    return new GetPostResponseDTO(Post);
  }

  @Put(':Id')
  @UseGuards(OnlyMemberGuard)
  async editPost(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() editPostBodyDTO: EditPostBodyDTO,
    @Req() request: Request,
  ): Promise<GetPostResponseDTO> {
    const Post = await this.postService.findPostById(Id);

    if (!Post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!Post.status) {
      throw new NotFoundException('삭제된 Post입니다.');
    }

    if (Post.userId !== request.user.Id) {
      throw new NotAcceptableException('유효하지 않은 접근입니다.');
    }

    const newPost = await this.postService.editPost(Post, editPostBodyDTO);
    return new GetPostResponseDTO(newPost);
  }

  @Delete(':Id')
  @UseGuards(OnlyMemberGuard)
  async deletePost(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() request: Request,
  ) {
    const Post = await this.postService.findPostById(Id);

    if (!Post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (Post.userId !== request.user.Id) {
      throw new NotAcceptableException('당신이 쓴 게시글이 아니다!!!!!');
    }

    try {
      this.postService.deletePost(Id);
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
    const Post = await this.postService.findPostById(Id);

    if (!Post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!Post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const isLiked = await this.postLikeService.checkUserLikedPost(
      Post.Id,
      request.user.Id,
    );

    return isLiked;
  }

  @Post(':Id/like')
  @UseGuards(OnlyMemberGuard)
  async updateLikes(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() request: Request,
  ) {
    const Post = await this.postService.findPostById(Id);

    if (!Post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!Post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const toggleResult = await this.postLikeService.toggleLikes(
      Id,
      request.user.Id,
    );

    try {
      toggleResult
        ? this.postService.incrementLikes(Id)
        : this.postService.decrementLikes(Id);
    } catch (e) {
      return { return: false };
    }

    return { return: true };
  }

  @Post(':Id/comment')
  @UseGuards(OnlyMemberGuard)
  async createComment(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() createCommentBodyDTO: CreateCommentBodyDTO,
    @Req() request: Request,
  ): Promise<GetCommentResponseDTO> {
    const Post = await this.postService.findPostById(Id);

    if (!Post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    const userId = request.user.Id;

    const Comment = await this.commentService.createComment(
      Id,
      userId,
      createCommentBodyDTO,
    );

    return new GetCommentResponseDTO(Comment);
  }

  async getPostsByPage(
    @Query('page') page: number,
    @Query('sort') sort: string,
  ) {
    return this.postService.findPostsByPage(page, sort);
  }
}
