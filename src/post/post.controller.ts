import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';

import { PostService } from './post.service';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { PostResponseDTO } from './dto/post-response.dto';

@Controller('post')
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Get(':Id')
  async getPostById(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<PostResponseDTO> {
    const Post = await this.postService.findPostById(Id);

    if (!Post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    return new PostResponseDTO(Post);
  }

  @Get()
  async getPostsByPage(
    @Query('page') page: number,
    @Query('sort') sort: string,
  ) {
    return this.postService.findPostsByPage(page, sort);
  }
}
