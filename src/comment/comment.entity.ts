import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from '../common/entity/base.entity';
import { CommentLikeEntity } from '../common/entity/comment-like.entity';
import { CommentReplyEntity } from '../common/entity/comment-reply.entity';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../post/post.entity';

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
    commentReply => commentReply.parentId,
  )
  public parent: CommentReplyEntity[];

  @OneToMany(
    type => CommentReplyEntity,
    comment => comment.childId,
  )
  public children: CommentReplyEntity[];

  @OneToMany(
    type => CommentLikeEntity,
    commentLike => commentLike.commentId,
  )
  public likedUsers: CommentLikeEntity[];
}
