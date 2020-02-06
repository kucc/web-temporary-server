import { PostEntity } from '../post.entity';

export class GetPostsResponseDTO {
  public constructor(post: PostEntity) {
    this.title = post.title;
    this.userId = post.userId;
    this.postTypeId = post.postTypeId;
    this.createdAt = post.createdAt;
    this.likes = post.likes;
    this.views = post.views;
  }
  public readonly title: string;
  public readonly userId: number;
  public readonly postTypeId: number;
  public readonly createdAt: string;
  public readonly likes: number;
  public readonly views: number;
}
