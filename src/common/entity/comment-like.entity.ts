import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { CommentEntity } from '../../comment/comment.entity';
import { UserEntity } from '../../user/user.entity';

@Entity({
  name: 'CommentLikes',
})
export class CommentLikeEntity {
  @ManyToOne(
    type => CommentEntity,
    comment => comment.likedUsers,
    {
      primary: true,
    },
  )
  @JoinColumn({
    name: 'commentId',
    referencedColumnName: 'Id',
  })
  public commentId: Number;

  @ManyToOne(
    type => UserEntity,
    user => user.likedComments,
    {
      primary: true,
    },
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public userId: Number;
}
