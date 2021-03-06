import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PostEntity } from './post.entity';
import { EditPostBodyDTO } from './dto/edit-post-body.dto';
import { CreatePostBodyDTO } from './dto/create-post-body.dto';
import { POSTS_PER_PAGE, IMAGES_PER_PAGE, POST_TYPE } from '../constants';

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

  public async incrementCommentsCount(Id: number) {
    await this.postRepository.increment({ Id }, 'commentsCount', 1);

    return { return: true };
  }

  public async decrementCommentsCount(Id: number) {
    await this.postRepository.decrement({ Id }, 'commentsCount', 1);

    return { return: true };
  }

  public async findPostsByPage(
    page: number,
    type: POST_TYPE,
  ): Promise<[PostEntity[], number]> {
    const skip = (page - 1) * POSTS_PER_PAGE;
    const take = POSTS_PER_PAGE;

    const result = await this.postRepository.findAndCount({
      where: { status: true, type },
      order: { Id: 'DESC' },
      skip,
      take,
    });
    return result;
  }

  public async findPostsWtihImagesByPage(
    page: number,
    type: POST_TYPE,
  ): Promise<[PostEntity[], number]> {
    const skip = (page - 1) * IMAGES_PER_PAGE;
    const take = IMAGES_PER_PAGE;

    const postsWithImages = await this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.images', 'image', 'image.status= :status', {
        status: true,
      })
      .where('post.status= :status', { status: true })
      .andWhere('post.type= :type', { type: POST_TYPE.GALLERY })
      .andWhere('image.isRepresentative= :isRepresentative', {
        isRepresentative: true,
      })
      .skip(skip)
      .take(take)
      .orderBy({ 'post.createdAt': 'DESC' })
      .getMany();

    const count = await this.postRepository.count({
      where: { status: true, type },
    });

    return [postsWithImages, count];
  }

  public async findPostsByUserId(
    userId: number,
    page: number,
  ): Promise<[PostEntity[], number]> {
    const skip = (page - 1) * POSTS_PER_PAGE;
    const take = POSTS_PER_PAGE;

    const result = await this.postRepository.findAndCount({
      where: {
        status: true,
        userId,
      },
      order: { Id: 'DESC' },
      skip,
      take,
    });

    return result;
  }
}
