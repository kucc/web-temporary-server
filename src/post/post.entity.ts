import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { Base } from '../common/entity/base.entity';
import { PostTypeEntity } from '../common/entity/post-type.entity';
import { PostLikeEntity } from '../post-like/post-like.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity({
  name: 'Posts',
})
export class PostEntity extends Base {
  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public title: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: true,
  })
  public content: string;

  @Column({
    name: 'likes',
    type: 'int',
    default: 0,
  })
  public likes: number;

  @Column({
    name: 'postTypeId',
    type: 'int',
    nullable: false,
  })
  public postTypeId: number;

  @ManyToOne(
    type => PostTypeEntity,
    postType => postType.posts,
  )
  @JoinColumn({
    name: 'postTypeId',
    referencedColumnName: 'Id',
  })
  public postType: PostTypeEntity;

  @Column({
    name: 'userId',
    type: 'int',
    nullable: false,
  })
  public userId: number;

  @ManyToOne(
    type => UserEntity,
    user => user.posts,
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public user: UserEntity;

  @OneToMany(
    type => PostLikeEntity,
    postLike => postLike.postId,
  )
  public likedUsers: PostLikeEntity[];

  @OneToMany(
    type => CommentEntity,
    comment => comment.postId,
  )
  public comments: CommentEntity[];
}
