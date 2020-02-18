import { PostEntity } from '../post.entity';
import { ImageResponseDTO } from '../../image/dto/image-response.dto';
import { ImageEntity } from '../../image/image.entity';

export class ImagePostResponseDTO {
  public constructor(post: PostEntity) {
    this.Id = post.Id;
    this.postTypeId = post.postTypeId;
    this.title = post.title;
    this.content = post.content;
    this.userId = post.userId;
    this.createdAt = post.createdAt;
    this.likes = post.likes;
    this.views = post.views;
    this.images = post.images;
  }

  public readonly Id: number;
  public readonly postTypeId: number;
  public readonly title: string;
  public readonly content: string;
  public readonly userId: number;
  public readonly createdAt: string;
  public readonly likes: number;
  public readonly views: number;
  public readonly images: ImageEntity[];
}
