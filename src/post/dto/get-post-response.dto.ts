import { PostEntity } from '../post.entity';

export class GetPostResponseDTO {
  public constructor(post: PostEntity) {
    this.Id = post.Id;
    this.title = post.title;
    this.content = post.content;
    this.userId = post.userId;
    this.postTypeId = post.postTypeId;
    this.createdAt = post.createdAt;
    this.likes = post.likes;
    this.views = post.views;
  }
  public readonly Id: number;
  public readonly title: string;
  public readonly content: string;
  public readonly userId: number;
  public readonly postTypeId: number;
  public readonly createdAt: string;
  public readonly likes: number;
  public readonly views: number;
}
