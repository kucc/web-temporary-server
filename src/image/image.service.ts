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
  public async getImagesByPage(page: number): Promise<ImageEntity[]> {
    const skip = (page - 1) * IMAGES_PER_PAGE;
    const take = IMAGES_PER_PAGE;

    const images = await this.imageRepository.find({
      where: { status: true, isRepresentative: true },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return images;
  }


    return postWithImages;
  }
}
