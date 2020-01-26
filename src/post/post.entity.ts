import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Base } from '../common/entity/base.entity';
import { PostTypeEntity } from '../common/entity/post-type.entity';
import { PostLikeEntity } from '../common/entity/post-like.entity';

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
  public likes: Number;

  @ManyToOne(
    type => PostTypeEntity,
    postType => postType.posts,
  )
  @JoinColumn({
    name: 'postTypeId',
    referencedColumnName: 'Id',
  })
  public postTypeId: Number;

  @OneToMany(
    type => PostLikeEntity,
    postLike => postLike.postId,
  )
  public likedUsers: PostLikeEntity[];
}
