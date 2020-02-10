import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PostLikeEntity } from './post-like.entity';

@Injectable()
export class PostLikeService {
  public constructor(
    @InjectRepository(PostLikeEntity)
    private readonly postLikeRepository: Repository<PostLikeEntity>,
  ) {}

  public async checkUserLikedPost(
    postId: number,
    userId: number,
  ): Promise<boolean> {
    const postLike = await this.postLikeRepository.findOne({
      where: {
        postId,
        userId,
      },
    });

    if (!postLike) {
      return false;
    }
    return true;
  }

  public async toggleLikes(postId: number, userId: number): Promise<boolean> {
    const postLike = await this.postLikeRepository.findOne({
      where: {
        postId,
        userId,
      },
    });

    if (!postLike) {
      await this.postLikeRepository.insert({ postId, userId });
      return true;
    }

    await this.postLikeRepository.delete({ postId, userId });
    return false;
  }
}
