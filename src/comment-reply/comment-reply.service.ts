import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentReplyEntity } from './comment-reply.entity';

@Injectable()
export class CommentReplyService {
  public constructor(
    @InjectRepository(CommentReplyEntity)
    public readonly commentReplyRepository: Repository<CommentReplyEntity>,
  ) {}

  public async addParentChildRelation(parentId: number, childId: number) {
    await this.commentReplyRepository.insert({ parentId, childId });

    return { return: true };
  }
}
