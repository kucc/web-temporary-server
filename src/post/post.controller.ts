import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  NotFoundException,
  Req,
  UseGuards,
  Delete,
  NotAcceptableException,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { POST_TYPE, POSTS_PER_PAGE } from '../constants';
import { PostService } from './post.service';
import { ImageEntity } from '../image/image.entity';
import { ImageService } from '../image/image.service';
import { EditPostBodyDTO } from './dto/edit-post-body.dto';
import { CommentService } from '../comment/comment.service';
import { CreatePostBodyDTO } from './dto/create-post-body.dto';
import { GetPostResponseDTO } from './dto/get-post-response.dto';
import { PostLikeService } from '../post-like/post-like.service';
import { ValidateIdPipe } from '../common/pipe/validate-id.pipe';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { CreateImageBodyDTO } from '../image/dto/create-image-body.dto';
import { GetPostListResponseDTO } from './dto/get-post-list-response.dto';
import { ImageListResponseDTO } from '../image/dto/image-list-response.dto';
import { CreateCommentBodyDTO } from '../comment/dto/create-comment-body.dto';
import { GetCommentResponseDTO } from '../comment/dto/get-comment-response.dto';
import { GetCommentListResponseDTO } from '../comment/dto/get-comment-list-response.dto';

@Controller('post')
export class PostController {
  public constructor(
    private readonly postService: PostService,
    private readonly postLikeService: PostLikeService,
    private readonly commentService: CommentService,
    private readonly imageService: ImageService,
  ) {}

  @Get(':Id')
  async getPostById(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<GetPostResponseDTO> {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    await this.postService.incrementViews(Id);
    const newPost = await this.postService.findPostById(Id);

    return new GetPostResponseDTO(newPost);
  }

  @Post('')
  @UseGuards(OnlyMemberGuard)
  async createPost(
    @Body() createPostBodyDTO: CreatePostBodyDTO,
    @Req() request: Request,
  ): Promise<GetPostResponseDTO> {
    const userId = request.user.Id;
    const post = await this.postService.createPost(userId, createPostBodyDTO);
    return new GetPostResponseDTO(post);
  }

  @Put(':Id')
  @UseGuards(OnlyMemberGuard)
  async editPost(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() editPostBodyDTO: EditPostBodyDTO,
    @Req() request: Request,
  ): Promise<GetPostResponseDTO> {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    if (post.userId !== request.user.Id) {
      throw new UnauthorizedException('유효하지 않은 접근입니다.');
    }

    const newPost = await this.postService.editPost(post, editPostBodyDTO);
    return new GetPostResponseDTO(newPost);
  }

  @Delete(':Id')
  @UseGuards(OnlyMemberGuard)
  async deletePost(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() request: Request,
  ) {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    if (post.userId !== request.user.Id) {
      throw new UnauthorizedException('유효하지 않은 접근입니다.');
    }

    const imageList = await this.imageService.findImagesInPost(Id);
    if (imageList.length > 0) {
      try {
        imageList.forEach(async image => {
          await this.imageService.deleteImage(image.Id);
        });
      } catch (e) {
        return { result: false };
      }
    }

    try {
      await this.postService.deletePost(Id);
    } catch (e) {
      return { result: false };
    }

    return { result: true };
  }

  @Get(':Id/like')
  @UseGuards(OnlyMemberGuard)
  async getLikeOfUser(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() request: Request,
  ): Promise<boolean> {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const isLiked = await this.postLikeService.checkUserLikedPost(
      post.Id,
      request.user.Id,
    );

    return isLiked;
  }

  @Post(':Id/like')
  @UseGuards(OnlyMemberGuard)
  async updateLikes(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() request: Request,
  ) {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const toggleResult = await this.postLikeService.toggleLikes(
      Id,
      request.user.Id,
    );

    try {
      toggleResult
        ? await this.postService.incrementLikes(Id)
        : await this.postService.decrementLikes(Id);
    } catch (e) {
      return { return: false };
    }

    return { return: true };
  }

  @Post(':Id/comment')
  @UseGuards(OnlyMemberGuard)
  async createComment(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() createCommentBodyDTO: CreateCommentBodyDTO,
    @Req() request: Request,
  ): Promise<GetCommentResponseDTO> {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const userId = request.user.Id;
    const isReply = false;

    const comment = await this.commentService.createComment(
      Id,
      userId,
      createCommentBodyDTO,
      isReply,
    );

    return new GetCommentResponseDTO(comment);
  }

  @Get(':Id/comment')
  @UseGuards(OnlyMemberGuard)
  async loadAllComments(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<GetCommentListResponseDTO> {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(`${Id}번 Post가 존재하지 않습니다.`);
    }

    if (!post.status) {
      throw new NotAcceptableException('삭제된 Post입니다.');
    }

    const comments = await this.commentService.findCommentsByPostId(Id);

    return new GetCommentListResponseDTO(comments);
  }

  /////////////////////////////////페이지로 불러오기///////////////////////////////////////////
  @Get('')
  async getPostsByPage(
    @Query('postTypeId', ValidateIdPipe) postTypeId: number = 1,
    @Query('page', ValidateIdPipe) page: number = 1,
  ): Promise<GetPostListResponseDTO> {
    if (postTypeId !== 4) {
      const [posts, count] = await this.postService.findPostsByPage(
        page,
        postTypeId,
      );

      if (!posts.length) {
        throw new NotFoundException(`${page} 페이지가 존재하지 않습니다.`);
      }

      return new GetPostListResponseDTO(posts, count);
    }

    if (postTypeId === 4) {
      const [posts, count] = await this.postService.findPostsWtihImagesByPage(
        page,
        postTypeId,
      );

      if (!posts.length) {
        throw new NotFoundException(`${page} 페이지가 존재하지 않습니다.`);
      }

      return new GetPostListResponseDTO(posts, count);
    }
  }

  /////////////////////////////////////한 포스트의 이미지리스트///////////////////////////////////////////
  @Get(':Id/images')
  async getImagesInPost(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<ImageListResponseDTO> {
    const post = await this.postService.findPostById(Id);
    if (!post) {
      throw new NotFoundException(
        `${Id}번에 해당하는 Post가 존재하지 않습니다.`,
      );
    }

    if (!post.status) {
      throw new NotFoundException(`${Id}번에 해당하는 Post가 삭제되었습니다.`);
    }
    const imageList = await this.imageService.findImagesInPost(Id);
    if (!imageList) {
      throw new NotFoundException(`Post에 이미지가 존재하지 않습니다.`);
    }

    return new ImageListResponseDTO(imageList);
  }

  /////////////////////////////////특정 이미지 관련 api////////////////////////////////////
  @Get(':postId/image/:imageId')
  async getImageById(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('imageId', ValidateIdPipe) imageId: number,
  ): Promise<ImageEntity> {
    const postWithImages = await this.postService.findPostById(postId);
    if (!postWithImages) {
      throw new NotFoundException(
        `${postId}번에 해당하는 Post가 존재하지 않습니다.`,
      );
    }

    if (!postWithImages.status) {
      throw new NotFoundException(`삭제된 Post입니다.`);
    }

    const image = await this.imageService.findImageById(imageId);
    if (!image) {
      throw new NotFoundException(
        `${imageId}에 해당하는 이미지가 존재하지 않습니다.`,
      );
    }

    return image;
  }

  @Post(':Id/image')
  @UseGuards(OnlyMemberGuard)
  async uploadImage(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() createImageBodyDTO: CreateImageBodyDTO,
  ): Promise<ImageEntity> {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(
        `${Id}번에 해당하는 Post가 존재하지 않습니다.`,
      );
    }

    if (!post.status) {
      throw new NotFoundException(`${Id}번에 해당하는 Post가 삭제되었습니다.`);
    }
    const image = await this.imageService.uploadImage(createImageBodyDTO, Id);

    if (!image) {
      throw new NotFoundException(`이미지 업로드에 실패했습니다.`);
    }

    if (post.postTypeId == 4) {
      const imageList = await this.imageService.findImagesInPost(Id);
      if (imageList.length == 1) {
        await this.imageService.setRepresentative(image.Id);
      }
    }

    const newImage = this.imageService.findImageById(image.Id);

    return newImage;
  }

  @Delete(':postId/image/:imageId')
  @UseGuards(OnlyMemberGuard)
  async deleteImage(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('imageId', ValidateIdPipe) imageId: number,
    @Req() req: Request,
  ) {
    const requestUserId = req.user.Id;

    const postWithImages = await this.postService.findPostById(postId);
    if (!postWithImages) {
      throw new NotFoundException(
        `${postWithImages.Id}번에 해당하는 Post가 존재하지 않습니다.`,
      );
    }

    if (postWithImages.userId !== requestUserId) {
      throw new UnauthorizedException(`유효하지 않은 접근입니다.`);
    }

    const image = await this.imageService.findImageById(imageId);
    if (!image) {
      throw new NotFoundException(
        `${imageId}번에 해당하는 이미지가 존재하지 않습니다.`,
      );
    }

    try {
      await this.imageService.deleteImage(imageId);
    } catch (e) {
      return { result: false };
    }

    if (postWithImages.postTypeId === 4) {
      const imageList = await this.imageService.findImagesInPost(postId);
      if (imageList.length > 0) {
        const firstImage = imageList[0];
        await this.imageService.setRepresentative(firstImage.Id);
      }
    }

    return { result: true };
  }
}
