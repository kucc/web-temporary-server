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
  UnauthorizedException,
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
import { GetPostListResponseDTO } from './dto/get-post-list-response.dto';
import { CreateCommentBodyDTO } from '../comment/dto/create-comment-body.dto';
import { GetCommentResponseDTO } from '../comment/dto/get-comment-response.dto';
import { GetCommentListResponseDTO } from '../comment/dto/get-comment-list-response.dto';

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
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    await this.postService.incrementViews(Id);
    const newPost = await this.postService.findPostById(Id);

    return new GetPostResponseDTO(newPost);
  }

  @Post('')
  @UseGuards(OnlyMemberGuard)
  async createPost(
    @Body() createPostBodyDTO: CreatePostBodyDTO,
    @Req() request: Request,
  ): Promise<GetPostResponseDTO> {
    const userId = request.user.Id;
    const post = await this.postService.createPost(userId, createPostBodyDTO);
    return new GetPostResponseDTO(post);
  }

  @Put(':Id')
  @UseGuards(OnlyMemberGuard)
  async editPost(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() editPostBodyDTO: EditPostBodyDTO,
    @Req() request: Request,
  ): Promise<GetPostResponseDTO> {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    if (post.userId !== request.user.Id) {
      throw new UnauthorizedException('유효하지 않은 접근입니다.');
    }

    const newPost = await this.postService.editPost(post, editPostBodyDTO);
    return new GetPostResponseDTO(newPost);
  }

  @Delete(':Id')
  @UseGuards(OnlyMemberGuard)
  async deletePost(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() request: Request,
  ) {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    if (post.userId !== request.user.Id) {
      throw new UnauthorizedException('유효하지 않은 접근입니다.');
    }

    try {
      await this.postService.deletePost(Id);
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
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const isLiked = await this.postLikeService.checkUserLikedPost(
      post.Id,
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
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const toggleResult = await this.postLikeService.toggleLikes(
      Id,
      request.user.Id,
    );

    try {
      toggleResult
        ? await this.postService.incrementLikes(Id)
        : await this.postService.decrementLikes(Id);
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
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const userId = request.user.Id;
    const isReply = false;

    const comment = await this.commentService.createComment(
      Id,
      userId,
      createCommentBodyDTO,
      isReply,
    );

    return new GetCommentResponseDTO(comment);
  }

  @Get(':Id/comment')
  @UseGuards(OnlyMemberGuard)
  async loadAllComments(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<GetCommentListResponseDTO> {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const comments = await this.commentService.findCommentsByPostId(Id);

    return new GetCommentListResponseDTO(comments);
  }

  @Get('')
  async getPostsByPage(
    @Query('page', ValidateIdPipe) page: number = 1,
  ): Promise<GetPostListResponseDTO> {
    const posts = await this.postService.findPostsByPage(page);

    if (!posts.length) {
      throw new NotFoundException(`${page} 페이지가 존재하지 않습니다.`);
    }

    const options = { where: { status: true } };
    const totalCount = await this.postService.getNumberOfPosts(options);

    return new GetPostListResponseDTO(posts, totalCount);
  }
}
