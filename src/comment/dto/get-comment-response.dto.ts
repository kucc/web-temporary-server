import { CommentEntity } from '../comment.entity';

export class GetCommentResponseDTO {
  public constructor(comment: CommentEntity) {
    this.content = comment.content;
    this.postId = comment.postId;
    this.userId = comment.userId;
    this.createdAt = comment.createdAt;
    this.likes = comment.likes;
  }
  public readonly content: string;
  public readonly postId: number;
  public readonly userId: number;
  public readonly createdAt: string;
  public readonly likes: number;
}
