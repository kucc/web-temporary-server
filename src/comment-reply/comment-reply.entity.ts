import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CommentEntity } from '../comment/comment.entity';

@Entity({
  name: 'CommentReplies',
})
export class CommentReplyEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  public Id: number;

  @Column({
    name: 'parentId',
    type: 'int',
    nullable: false,
  })
  public parentId: number;

  @ManyToOne(
    type => CommentEntity,
    comment => comment.parent,
  )
  @JoinColumn({
    name: 'parentId',
    referencedColumnName: 'Id',
  })
  public parent: CommentEntity;

  @Column({
    name: 'childId',
    type: 'int',
    nullable: false,
  })
  public childId: number;

  @ManyToOne(
    type => CommentEntity,
    comment => comment.children,
  )
  @JoinColumn({
    name: 'childId',
    referencedColumnName: 'Id',
  })
  public child: CommentEntity;
}
