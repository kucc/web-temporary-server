import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';

import { PostEntity } from './post.entity';
import { POSTS_PER_PAGE } from '../constants';
import { EditPostBodyDTO } from './dto/edit-post-body.dto';
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
    const post = this.postRepository.create(createPostBodyDTO);
    await this.postRepository.save(post);

    return post;
  }

  public async editPost(
    post: PostEntity,
    editPostBodyDTO: EditPostBodyDTO,
  ): Promise<PostEntity> {
    const newPost = this.postRepository.merge(post, editPostBodyDTO);
    await this.postRepository.save(newPost);

    return newPost;
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

  public async incrementViews(Id: number) {
    await this.postRepository.increment({ Id }, 'views', 1);

    return { return: true };
  }

  public async findPostsByPage(page: number): Promise<PostEntity[]> {
    const skip = (page - 1) * POSTS_PER_PAGE;
    const take = POSTS_PER_PAGE;

    const posts = await this.postRepository.find({
      where: { status: true },
      order: { Id: 'DESC' },
      skip,
      take,
    });

    return posts;
  }

  public async findPostsByUserId(
    userId: number,
    page: number,
  ): Promise<PostEntity[]> {
    const skip = (page - 1) * POSTS_PER_PAGE;
    const take = POSTS_PER_PAGE;

    const posts = await this.postRepository.find({
      where: {
        status: true,
        userId,
      },
      order: { Id: 'DESC' },
      skip,
      take,
    });

    return posts;
  }

  public async getNumberOfPosts(
    options?: FindManyOptions<PostEntity>,
  ): Promise<number> {
    const count = await this.postRepository.count(options);

    return count;
  }
}
