import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PostEntity } from './post.entity';
import { CreatePostBodyDTO } from './dto/create-post-body.dto';

@Injectable()
export class PostService {
  public constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  public async findPostById(Id: number): Promise<PostEntity> {
    return await this.postRepository.findOne({
      where: {
        Id,
      },
    });
  }

  public async createPost(
    userId: number,
    createPostBodyDTO: CreatePostBodyDTO,
  ): Promise<PostEntity> {
    createPostBodyDTO.userId = userId;
    const Post = this.postRepository.create(createPostBodyDTO);
    await this.postRepository.save(Post);

    return Post;
  }

  public async deletePost(Id: number) {
    await this.postRepository.update(Id, { status: false });

    return { return: true };
  }

  public async incrementLikes(Id: number) {
    await this.postRepository.increment({ Id }, 'likes', 1);

    return { return: true };
  }
  public async decrementLikes(Id: number) {
    await this.postRepository.decrement({ Id }, 'likes', 1);

    return { return: true };
  }

  public async findPostsByPage(
    page: number,
    sort: string = 'desc',
  ): Promise<PostEntity[]> {
    // TODO:
    //  ORM methods
    //  createdAt 기준 정렬,
    //  if N <= viewCount:
    //    [1, N] 리턴
    //  else:
    //    [p * (viewCount -1) + 1, p * viewCount) 리턴

    console.log(`page: ${page}, sort: ${sort}`);
    return await this.postRepository.find({ relations: ['postTypeId'] });
  }
}
