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

  public async toggleLikes(postId: number, userId: number): Promise<boolean> {
    const PostLike = await this.postLikeRepository.findOne({
      where: {
        postId,
        userId,
      },
    });

    if (!PostLike) {
      await this.postLikeRepository.insert({ postId, userId });
      return true;
    }

    await this.postLikeRepository.delete({ postId, userId });
    return false;
  }
}
