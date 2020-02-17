import { ImageEntity } from '../image.entity';
import { ImageResponseDTO } from './image-response.dto';
import { PostEntity } from '../../post/post.entity';

export class GetImageListResponseDTO {
  public constructor(posts: PostEntity[]) {
    this.count = posts.length;
    this.data = posts.map(post => {
      return {
        title: post.title,
        user: post.user,
        postTypeId: post.postTypeId,
        createdAt: post.createdAt,
        likes: post.likes,
        views: post.views,
        images: post.images.map(image => {
          return new ImageResponseDTO(image);
        }),
      };
    });
  }

  public readonly count: number;
  public readonly data: object;
}
