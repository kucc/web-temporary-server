import { PostEntity } from '../post.entity';

export class PostResponseDTO {
  public constructor(post: PostEntity) {
    this.title = post.title;
    this.content = post.content;
    // To be discussed
    // this.userId = post.userId;
    this.postTypeId = post.postTypeId;
  }
  public readonly title: string;
  public readonly content: string;
  // To be discussed
  // public readonly userId: number;
  public readonly postTypeId: number;
}
