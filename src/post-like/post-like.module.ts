import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostLikeService } from './post-like.service';
import { PostLikeEntity } from './post-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLikeEntity])],
  providers: [PostLikeService],
  exports: [PostLikeService],
})
export class PostLikeModule {}
