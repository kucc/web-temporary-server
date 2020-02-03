import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentEntity } from './comment.entity';
import { CreateCommentBodyDTO } from './dto/create-comment-body.dto';

@Injectable()
export class CommentService {
  public constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  public async createComment(
    postId: number,
    userId: number,
    createCommentBodyDTO: CreateCommentBodyDTO,
  ): Promise<CommentEntity> {
    createCommentBodyDTO.postId = postId;
    createCommentBodyDTO.userId = userId;
    const Comment = this.commentRepository.create(createCommentBodyDTO);

    await this.commentRepository.save(Comment);

    return Comment;
  }
}
