import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { CommentEntity } from '../../comment/comment.entity';
import { UserEntity } from '../../user/user.entity';

@Entity({
  name: 'CommentLikes',
})
export class CommentLikeEntity {
  @Column({
    name: 'commentId',
    type: 'int',
    nullable: false,
    primary: true,
  })
  public commentId: number;

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
  public comment: CommentEntity;

  @Column({
    name: 'userId',
    type: 'int',
    nullable: false,
    primary: true,
  })
  public userId: number;

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
  public user: UserEntity;
}
