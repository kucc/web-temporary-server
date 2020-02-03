import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity({
  name: 'CommentLikes',
})
@Unique(['commentId', 'userId'])
export class CommentLikeEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  public Id: number;

  @Column({
    name: 'commentId',
    type: 'int',
    nullable: false,
  })
  public commentId: number;

  @ManyToOne(
    type => CommentEntity,
    comment => comment.likedUsers,
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
  })
  public userId: number;

  @ManyToOne(
    type => UserEntity,
    user => user.likedComments,
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public user: UserEntity;
}
