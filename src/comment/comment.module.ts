import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentLikeModule } from '../comment-like/comment-like.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), CommentLikeModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
