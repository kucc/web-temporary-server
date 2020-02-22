import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ImageEntity } from './image.entity';
import { CreateImageBodyDTO } from './dto/create-image-body.dto';

@Injectable()
export class ImageService {
  public constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  public async findImageById(Id: number): Promise<ImageEntity> {
    return await this.imageRepository.findOne({
      where: {
        Id,
        status: true,
      },
    });
  }

  public async uploadImages(
    createImagesBodyDTO: CreateImageBodyDTO[],
    postId: number,
  ): Promise<ImageEntity[]> {
    console.log(createImagesBodyDTO);
    const images = this.imageRepository
      .create(createImagesBodyDTO)
      .map(imageEntity => {
        imageEntity.postId = postId;
        return imageEntity;
      });

    await this.imageRepository.save(images);

    return images;
  }

  public async deleteImage(Id: number) {
    await this.imageRepository.update(Id, { status: false });

    return { result: true };
  }

  public async findImagesInPost(postId: number): Promise<ImageEntity[]> {
    const images = await this.imageRepository.find({
      where: {
        postId,
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
