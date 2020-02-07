import { PostEntity } from '../post.entity';

export class GetPostListResponseDTO {
  public constructor(posts: PostEntity[]) {
    this.count = posts.length;
    this.data = posts.map(post => {
      return {
        title: post.title,
        userId: post.userId,
        postTypeId: post.postTypeId,
        createdAt: post.createdAt,
        likes: post.likes,
        views: post.views,
      };
    });
  }
  public readonly count: number;
  public readonly data: object;
}
