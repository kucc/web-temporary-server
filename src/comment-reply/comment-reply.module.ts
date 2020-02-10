import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentReplyEntity } from './comment-reply.entity';
import { CommentReplyService } from './comment-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentReplyEntity])],
  providers: [CommentReplyService],
  exports: [CommentReplyService],
})
export class CommentReplyModule {}
