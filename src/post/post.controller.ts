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
} from '@nestjs/common';
import { Request } from 'express';

import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { CreatePostBodyDTO } from './dto/create-post-body.dto';
import { ValidateIdPipe } from '../common/pipe/validate-id.pipe';
import { GetPostResponseDTO } from './dto/get-post-response.dto';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';

@Controller('post')
export class PostController {
  public constructor(private readonly postService: PostService) {}

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
  async getPostsByPage(
    @Query('page') page: number,
    @Query('sort') sort: string,
  ) {
    return this.postService.findPostsByPage(page, sort);
  }
}
