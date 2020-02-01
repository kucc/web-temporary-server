import { PostEntity } from '../post.entity';

export class PostResponseDTO {
  public constructor(post: PostEntity) {
    this.title = post.title;
    this.content = post.content;
    this.userId = post.userId;
    this.postTypeId = post.postTypeId;
  }
  public readonly title: string;
  public readonly content: string;
  public readonly userId: number;
  public readonly postTypeId: number;
}
