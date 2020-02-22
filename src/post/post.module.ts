import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ImageModule } from '../image/image.module';
import { CommentModule } from '../comment/comment.module';
import { PostLikeModule } from '../post-like/post-like.module';
import { CommentLikeModule } from '../comment-like/comment-like.module';
import { CommentReplyModule } from '../comment-reply/comment-reply.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    PostLikeModule,
    CommentModule,
    CommentLikeModule,
    CommentReplyModule,
    ImageModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
