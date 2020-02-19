import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ImageEntity } from './image.entity';
import { IMAGES_PER_PAGE } from '../constants';
import { CreateImageBodyDTO } from './dto/create-image-body.dto';

@Injectable()
export class ImageService {
  public constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  public async findImage(Id: number): Promise<ImageEntity> {
    return await this.imageRepository.findOne({
      where: {
        Id,
        status: true,
      },
    });
  }

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

  public async uploadImage(
    createImageBodyDTO: CreateImageBodyDTO,
    postId: number,
  ): Promise<ImageEntity> {
    createImageBodyDTO.postId = postId;
    const image = this.imageRepository.create(createImageBodyDTO);
    await this.imageRepository.save(image);

    return image;
  }

  public async deleteImage(Id: number) {
    await this.imageRepository.update(Id, { status: false });

    return { result: true };
  }

  public async makeImageList(postId: number): Promise<ImageEntity[]> {
    const images = await this.imageRepository.find({
      where: {
        postId: postId,
        status: true,
      },
      order: { Id: 'ASC' },
    });

    return images;
  }

  public async setRepresentative(Id: number) {
    // 대표이미지 설정하기
    //올린 이미지 리스트 중 ID가 제일 작은 이미지가 대표 이미지가 된다.
    await this.imageRepository.update(Id, { isRepresentative: true });

    return { result: true };
  }
}
