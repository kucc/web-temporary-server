import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';

@Controller('post')
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Get(':Id')
  async getPostById(
    return this.postService.findPostById(Id);
  }
  @Get()
  async getPostsByPage(
    return this.postService.findPostsByPage(page, sort);
  }
}
