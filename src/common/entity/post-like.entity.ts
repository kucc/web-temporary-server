import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PostEntity } from '../../post/post.entity';
import { UserEntity } from '../../user/user.entity';

@Entity({
  name: 'PostLikes',
})
export class PostLikeEntity {
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
  public postId: Number;

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
  public userId: Number;
}
