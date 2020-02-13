import { PostEntity } from '../post.entity';
import { GetPostListElementDTO } from './get-post-list-element.dto';

export class GetPostListResponseDTO {
  public constructor(posts: PostEntity[], totalCount: number) {
    this.totalCount = totalCount;
    this.count = posts.length;
    this.data = posts.map(post => new GetPostListElementDTO(post));
  }
  public readonly totalCount: number;
  public readonly count: number;
  public readonly data: object;
}
