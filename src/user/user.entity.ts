import { Entity, Column, OneToMany } from 'typeorm';

import { PostEntity } from '../post/post.entity';
import { EventEntity } from '../event/event.entity';
import { Base } from '../common/entity/base.entity';
import { CommentEntity } from '../comment/comment.entity';
import { ProjectEntity } from '../project/project.entity';
import { PostLikeEntity } from '../post-like/post-like.entity';
import { UserProjectEntity } from '../user-project/user-project.entity';
import { CommentLikeEntity } from '../common/entity/comment-like.entity';

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
    type => ProjectEntity,
    project => project.userId,
  )
  public projects: ProjectEntity[];

  @OneToMany(
    type => UserProjectEntity,
    userProject => userProject.userId,
  )
  public userProjects: UserProjectEntity[];

  @OneToMany(
    type => EventEntity,
    eventEntity => eventEntity.userId,
  )
  public events: EventEntity[];

  @OneToMany(
    type => CommentEntity,
    comment => comment.userId,
  )
  public comments: CommentEntity[];

  @OneToMany(
    type => PostEntity,
    post => post.userId,
  )
  public posts: PostEntity[];
}
