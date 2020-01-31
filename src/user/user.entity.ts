import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from '../common/entity/base.entity';
import { CommentLikeEntity } from '../common/entity/comment-like.entity';
import { PostLikeEntity } from '../common/entity/post-like.entity';
import { UserProjectEntity } from '../common/entity/user-project.entity';
import { EventEntity } from '../event/event.entity';

@Entity({
  name: 'Users',
})
export class UserEntity extends Base {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 254,
    nullable: false,
    unique: true,
  })
  public email: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public name: string;

  @Column({
    name: 'nickname',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public nickname: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  public password: string;

  @Column({
    name: 'salt',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public salt: string;

  @Column({
    name: 'isAdmin',
    type: 'boolean',
    default: false,
  })
  public isAdmin: boolean;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description: string;

  @OneToMany(
    type => CommentLikeEntity,
    commentLike => commentLike.userId,
  )
  public likedComments: CommentLikeEntity[];

  @OneToMany(
    type => PostLikeEntity,
    postLike => postLike.userId,
  )
  public likedPosts: PostLikeEntity[];

  @OneToMany(
    type => UserProjectEntity,
    userProject => userProject.userId,
  )
  public projects: UserProjectEntity[];

  @OneToMany(
    type => EventEntity,
    eventEntity => eventEntity.userId,
  )
  public events: EventEntity[];
}
