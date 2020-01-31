import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from '../common/entity/base.entity';
import { CommentLikeEntity } from '../common/entity/comment-like.entity';
import { CommentReplyEntity } from '../common/entity/comment-reply.entity';
import { UserEntity } from '../user/user.entity';

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
  public likes: Number;

  @ManyToOne(
    type => UserEntity,
    user => user.comments,
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public userId: Number;

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
