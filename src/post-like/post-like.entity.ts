import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';

@Entity({
  name: 'PostLikes',
})
export class PostLikeEntity {
  @Column({
    name: 'postId',
    type: 'int',
    nullable: false,
    primary: true,
  })
  public postId: number;

  @ManyToOne(
    type => PostEntity,
    post => post.likedUsers,
    {
      primary: true,
    },
  )
  @JoinColumn({
    name: 'postId',
    referencedColumnName: 'Id',
  })
  public post: PostEntity;

  @Column({
    name: 'userId',
    type: 'int',
    nullable: false,
  })
  public userId: number;

  @ManyToOne(
    type => UserEntity,
    user => user.likedPosts,
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
