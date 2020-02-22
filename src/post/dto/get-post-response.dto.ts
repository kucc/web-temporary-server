import { PostEntity } from '../post.entity';
import { POST_TYPE } from '../../constants';

export class GetPostResponseDTO {
  public constructor(post: PostEntity) {
    this.Id = post.Id;
    this.title = post.title;
    this.content = post.content;
    this.userId = post.userId;
    this.type = post.type;
    this.createdAt = post.createdAt;
    this.likes = post.likes;
    this.views = post.views;
    this.commentsCount = post.commentsCount;
  }
  public readonly Id: number;
  public readonly title: string;
  public readonly content: string;
  public readonly userId: number;
  public readonly type: string;
  public readonly createdAt: string;
  public readonly likes: number;
  public readonly commentsCount: number;
  public readonly views: number;
}
