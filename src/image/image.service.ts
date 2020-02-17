import { Repository, getRepository, createQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ImageEntity } from './image.entity';
import { IMAGES_PER_PAGE } from '../constants';
import { PostEntity } from '../post/post.entity';

@Injectable()
export class ImageService {
  public constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  public async findImagesByPage(page: number): Promise<PostEntity[]> {
    const skip = (page - 1) * IMAGES_PER_PAGE;
    const take = IMAGES_PER_PAGE;

    const postWithImages = await getRepository(PostEntity)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.images', 'image')
      .where('post.status=:status', { status: true })
      .andWhere('post.postTypeId=:postTypeId', { postTypeId: 4 })
      .andWhere('image.status = :status', { status: true })
      .andWhere('image.IsRepresentative = :IsRepresentative', {
        IsRepresentative: true,
      })
      .getMany();

    return postWithImages;
  }
}
