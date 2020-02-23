import { CommentEntity } from '../comment.entity';

export class GetCommentListElementDTO {
  public constructor(comment: CommentEntity) {
    this.Id = comment.Id;
    this.content = comment.content;
    this.status = comment.status;
    this.postId = comment.postId;
    this.userId = comment.userId;
    this.createdAt = comment.createdAt;
    this.likes = comment.likes;
  }
  public readonly Id: number;
  public readonly content: string;
  public readonly status: boolean;
  public readonly postId: number;
  public readonly userId: number;
  public readonly createdAt: string;
  public readonly likes: number;
}
