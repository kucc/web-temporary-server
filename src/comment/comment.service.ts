import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentEntity } from './comment.entity';
import { EditCommentBodyDTO } from './dto/edit-comment-body.dto';
import { CreateCommentBodyDTO } from './dto/create-comment-body.dto';

@Injectable()
export class CommentService {
  public constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  public async findCommentById(Id: number): Promise<CommentEntity> {
    return await this.commentRepository.findOne({
      where: {
        Id,
      },
    });
  }

  public async createComment(
    postId: number,
    userId: number,
    createCommentBodyDTO: CreateCommentBodyDTO,
    isReply: boolean,
  ): Promise<CommentEntity> {
    createCommentBodyDTO.postId = postId;
    createCommentBodyDTO.userId = userId;
    createCommentBodyDTO.isReply = isReply;

    const Comment = this.commentRepository.create(createCommentBodyDTO);

    await this.commentRepository.save(Comment);

    return Comment;
  }

  public async editComment(
    Comment: CommentEntity,
    editCommentBodyDTO: EditCommentBodyDTO,
  ): Promise<CommentEntity> {
    const newComment = this.commentRepository.merge(
      Comment,
      editCommentBodyDTO,
    );

    await this.commentRepository.save(newComment);
    return newComment;
  }

  public async deleteComment(Id: number) {
    await this.commentRepository.update(Id, { status: false });

    return { return: true };
  }

  public async findCommentsByPostId(Id: number): Promise<CommentEntity[]> {
    const comments = await this.commentRepository.find({
      where: { postId: Id, isReply: false },
    });

    return comments;
  }

  public async incrementLikes(Id: number) {
    await this.commentRepository.increment({ Id }, 'likes', 1);

    return { return: true };
  }

  public async decrementLikes(Id: number) {
    await this.commentRepository.decrement({ Id }, 'likes', 1);

    return { return: true };
  }
}
