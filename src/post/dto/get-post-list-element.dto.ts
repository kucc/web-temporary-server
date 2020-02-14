import { PostEntity } from '../post.entity';

export class GetPostListElementDTO {
  public constructor(post: PostEntity) {
    this.Id = post.Id;
    this.title = post.title;
    this.userId = post.userId;
    this.postTypeId = post.postTypeId;
    this.createdAt = post.createdAt;
    this.likes = post.likes;
    this.view = post.views;
  }
  public readonly Id: number;
  public readonly title: string;
  public readonly userId: number;
  public readonly postTypeId: number;
  public readonly createdAt: string;
  public readonly likes: number;
  public readonly view: number;
}
