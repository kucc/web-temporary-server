import { CommentEntity } from '../comment.entity';

export class GetCommentListElementDTO {
  public constructor(comment: CommentEntity) {
    this.content = comment.content;
    this.userId = comment.userId;
    this.createdAt = comment.createdAt;
    this.likes = comment.likes;
  }
  public readonly content: string;
  public readonly userId: number;
  public readonly createdAt: string;
  public readonly likes: number;
}
