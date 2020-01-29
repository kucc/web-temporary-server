import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';

@Controller('post')
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Get(':Id')
  getPostById(@Param('Id', ValidateIdPipe) Id: Number) {
    return this.postService.findPostById(Id);
  }
}
