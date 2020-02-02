import { PostEntity } from '../post.entity';

export class GetPostResponseDTO {
  public constructor(post: PostEntity) {
    this.title = post.title;
    this.content = post.content;
    this.userId = post.userId;
    this.postTypeId = post.postTypeId;
    this.createdAt = post.createdAt;
    this.likes = post.likes;
  }
  public readonly title: string;
  public readonly content: string;
  public readonly userId: number;
  public readonly postTypeId: number;
  public readonly createdAt: string;
  public readonly likes: number;
}
