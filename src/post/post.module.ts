import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostLikeModule } from '../post-like/post-like.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), PostLikeModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
