import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Repository } from 'typeorm';

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
      relations: ['postTypeId'],
    });
  }

  public async findPostsByPage(
    page: number,
    sort: string = 'desc',
  ): Promise<PostEntity[]> {
    // TODO:
    // 1. 한 페이지에 보여줄 게시물 갯수 논의 (viewCount)
    // 2. algorithm
    //  N = 총 게시물 수(status가 true인 게시물 수)
    //  p = page(query parameter)
    //  pageCount = ceiling(N / viewCount)
    //  p > pageCount: invalid error
    //
    //  createdAt 기준 정렬,
    //  if N <= viewCount:
    //    [1, N] 리턴
    //  else:
    //    [p * (viewCount -1) + 1, p * viewCount) 리턴

    console.log(`page: ${page}, sort: ${sort}`);
    return await this.postRepository.find({ relations: ['postTypeId'] });
  }
}
