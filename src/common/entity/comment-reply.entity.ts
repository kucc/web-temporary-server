import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { CommentEntity } from '../../comment/comment.entity';

@Entity({
  name: 'CommentReplies',
})
export class CommentReplyEntity {
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
  public parentId: number;

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
  public childId: number;
}
