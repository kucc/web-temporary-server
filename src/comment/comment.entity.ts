import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../post/post.entity';
import { Base } from '../common/entity/base.entity';
import { CommentLikeEntity } from '../comment-like/comment-like.entity';
import { CommentReplyEntity } from '../comment-reply/comment-reply.entity';

@Entity({
  name: 'Comments',
})
export class CommentEntity extends Base {
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
    name: 'userId',
    type: 'int',
    nullable: false,
  })
  public userId: number;

  @Column({
    name: 'isReply',
    type: 'boolean',
    nullable: false,
  })
  public isReply: boolean;

  @ManyToOne(
    type => UserEntity,
    user => user.comments,
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public user: UserEntity;

  @Column({
    name: 'postId',
    type: 'int',
    nullable: false,
  })
  public postId: number;

  @ManyToOne(
    type => PostEntity,
    post => post.comments,
  )
  @JoinColumn({
    name: 'postId',
    referencedColumnName: 'Id',
  })
  public post: PostEntity;

  @OneToMany(
    type => CommentReplyEntity,
    commentReply => commentReply.parent,
  )
  public parent: CommentReplyEntity[];

  @OneToMany(
    type => CommentReplyEntity,
    comment => comment.child,
  )
  public children: CommentReplyEntity[];

  @OneToMany(
    type => CommentLikeEntity,
    commentLike => commentLike.comment,
  )
  public likedUsers: CommentLikeEntity[];
}
