import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentLikeEntity } from './comment-like.entity';

@Injectable()
export class CommentLikeService {
  public constructor(
    @InjectRepository(CommentLikeEntity)
    private readonly commentLikeRepository: Repository<CommentLikeEntity>,
  ) {}

  public async findEntity(commentId: number, userId: number): Promise<boolean> {
    const CommentLike = await this.commentLikeRepository.findOne({
      where: {
        commentId,
        userId,
      },
    });

    if (!CommentLike) {
      return false;
    }
    return true;
  }

  public async toggleLikes(
    commentId: number,
    userId: number,
  ): Promise<boolean> {
    const CommentLike = await this.commentLikeRepository.findOne({
      where: {
        commentId,
        userId,
      },
    });

    if (!CommentLike) {
      await this.commentLikeRepository.insert({ commentId, userId });
      return true;
    }

    await this.commentLikeRepository.delete({ commentId, userId });
    return false;
  }
}
