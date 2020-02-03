import { Module } from '@nestjs/common';
import { PostLikeService } from './post-like.service';

@Module({
  providers: [PostLikeService]
})
export class PostLikeModule {}
