import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { CommentEntity } from '../../comment/comment.entity';

@Entity({
  name: 'CommentReplies',
})
export class CommentReplyEntity {
  @Column({
    name: 'parentId',
    type: 'int',
    nullable: false,
    primary: true,
  })
  public parentId: number;

  @ManyToOne(
    type => CommentEntity,
    comment => comment.parent,
    {
      primary: true,
    },
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
    primary: true,
  })
  public childId: number;

  @ManyToOne(
    type => CommentEntity,
    comment => comment.children,
    {
      primary: true,
    },
  )
  @JoinColumn({
    name: 'childId',
    referencedColumnName: 'Id',
  })
  public child: CommentEntity;
}
