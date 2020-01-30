import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Repository } from 'typeorm';
import { PostTypeEntity } from 'src/common/entity/post-type.entity';

@Injectable()
export class PostService {
  public constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  public async findPostById(Id: Number): Promise<PostEntity> {
    return await this.postRepository.findOne({
      where: {
        Id,
      },
      relations: ['postTypeId'],
    });
  }
}
