import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentLikeEntity } from './comment-like.entity';
import { CommentLikeService } from './comment-like.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentLikeEntity])],
  providers: [CommentLikeService],
  exports: [CommentLikeService],
})
export class CommentLikeModule {}
