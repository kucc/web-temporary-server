import { PostEntity } from '../post.entity';
import { ImageEntity } from '../../image/image.entity';
import { POST_TYPE } from '../../constants';

export class GetPostListElementDTO {
  public constructor(post: PostEntity) {
    this.Id = post.Id;
    this.title = post.title;
    this.userId = post.userId;
    this.type = post.type;
    this.createdAt = post.createdAt;
    this.likes = post.likes;
    this.view = post.views;
    this.image = post.images;
  }
  public readonly Id: number;
  public readonly title: string;
  public readonly userId: number;
  public readonly type: string;
  public readonly createdAt: string;
  public readonly likes: number;
  public readonly view: number;
  public readonly image?: ImageEntity[];
}
