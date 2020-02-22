import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { POST_TYPE } from '../constants';
import { UserEntity } from '../user/user.entity';
import { Base } from '../common/entity/base.entity';
import { ImageEntity } from '../image/image.entity';
import { CommentEntity } from '../comment/comment.entity';
import { PostLikeEntity } from '../post-like/post-like.entity';

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
    name: 'views',
    type: 'int',
    default: 0,
  })
  public views: number;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public type: POST_TYPE;

  @Column({
    name: 'userId',
    type: 'int',
    nullable: false,
  })
  public userId: number;

  @Column({
    name: 'commentsCount',
    type: 'int',
    nullable: false,
    default: 0,
  })
  public commentsCount: number;

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
    postLike => postLike.post,
  )
  public likedUsers: PostLikeEntity[];

  @OneToMany(
    type => CommentEntity,
    comment => comment.post,
  )
  public comments: CommentEntity[];

  @OneToMany(
    type => ImageEntity,
    image => image.post,
  )
  public images: ImageEntity[];
}
