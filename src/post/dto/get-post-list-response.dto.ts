import { PostEntity } from '../post.entity';
import { GetPostListElementDTO } from './get-post-list-element.dto';

export class GetPostListResponseDTO {
  public constructor(posts: PostEntity[], count: number) {
    this.count = count;
    this.data = posts.map(post => new GetPostListElementDTO(post));
  }
  public readonly count: number;
  public readonly data: object;
}
