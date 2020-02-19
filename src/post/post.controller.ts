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
import { ImagePostResponseDTO } from './dto/image-post-repsponse.dto';
import { CreateImageBodyDTO } from '../image/dto/create-image-body.dto';
import { UpdateImagePostBodyDTO } from './dto/update-image-post-body.dto';
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

  @Get('')
  async getPostsByPage(
    @Query('postTypeId', ValidateIdPipe) postTypeId: number,
    @Query('page', ValidateIdPipe) page: number = 1,
  ): Promise<GetPostListResponseDTO> {
    const [posts, count] = await this.postService.findPostsByPage(
      page,
      postTypeId,
    );

    if (!posts.length) {
      throw new NotFoundException(`${page} 페이지가 존재하지 않습니다.`);
    }

    return new GetPostListResponseDTO(posts, count);
  }

  @Get('image/:postId')
  async getImagePostById(
    @Param('postId', ValidateIdPipe) postId: number,
  ): Promise<ImagePostResponseDTO> {
    const imagePost = await this.postService.findImagePostById(postId);

    if (!imagePost) {
      throw new NotFoundException(
        `${postId}번에 해당하는 갤러리가 존재하지 않습니다.`,
      );
    }

    return new ImagePostResponseDTO(imagePost);
  }

  @Get('image')
  async getImagePostsByPage(
    @Query('page', ValidateIdPipe) page: number = 1,
  ): Promise<ImageListResponseDTO> {
    const images = await this.imageService.getImagesByPage(page);

    if (!images.length) {
      throw new NotFoundException(`${page} 페이지가 존재하지 않습니다.`);
    }

    return new ImageListResponseDTO(images);
  }

  @Get('image/:postId/:imageId')
  async getImageById(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('imageId', ValidateIdPipe) imageId: number,
  ): Promise<ImageEntity> {
    const postWithImages = await this.postService.findImagePostById(postId);
    if (!postWithImages) {
      throw new NotFoundException(
        `${postId}번에 해당하는 갤러리가 존재하지 않습니다.`,
      );
    }

    const image = await this.imageService.findImageById(postId, imageId);
    if (!image) {
      throw new NotFoundException(
        `${imageId}에 해당하는 이미지가 존재하지 않습니다.`,
      );
    }

    return image;
  }

  @Post('image')
  @UseGuards(OnlyMemberGuard)
  async createImagePost(@Req() req: Request): Promise<ImagePostResponseDTO> {
    const userId = req.user.Id;

    const imagePost = await this.postService.createImagePost(userId);

    if (!imagePost) {
      throw new NotFoundException(
        `${imagePost.Id}번에 해당하는 갤러리가 존재하지 않습니다.`,
      );
    }

    return new ImagePostResponseDTO(imagePost);
  }

  @Delete('image/:postId')
  @UseGuards(OnlyMemberGuard)
  async deleteImagePost(
    @Param('postId', ValidateIdPipe) postId: number,
    @Req() req: Request,
  ) {
    const requestUserId = req.user.Id;

    const postWithImages = await this.postService.findImagePostById(postId);
    if (!postWithImages) {
      throw new NotFoundException(
        `${postWithImages.Id}번에 해당하는 갤러리가 존재하지 않습니다.`,
      );
    }

    if (postWithImages.userId !== requestUserId) {
      throw new UnauthorizedException(`유효하지 않은 접근입니다.`);
    }

    const imageList = postWithImages.images;
    if (!imageList) {
      throw new NotFoundException(`이미지가 존재하지 않습니다.`);
    }

    try {
      imageList.forEach(async image => {
        await this.imageService.deleteImage(image.Id);
      });

      await this.postService.deletePost(postId);
    } catch (e) {
      return { result: false };
    }

    return { result: true };
  }

  @Post('image/:postId/upload')
  @UseGuards(OnlyMemberGuard)
  async uploadImage(
    @Param('postId', ValidateIdPipe) postId: number,
    @Body() createImageBodyDTO: CreateImageBodyDTO,
  ): Promise<ImageEntity> {
    const post = await this.postService.findImagePostById(postId);

    if (!post) {
      throw new NotFoundException(
        `${postId}번에 해당하는 갤러리가 존재하지 않습니다.`,
      );
    }
    const image = await this.imageService.uploadImage(
      createImageBodyDTO,
      postId,
    );

    if (!image) {
      throw new NotFoundException(`이미지 업로드에 실패했습니다.`);
    }

    return image;
  }

  @Put('image/:postId')
  @UseGuards(OnlyMemberGuard)
  async updateImagesToPost(
    @Param('postId', ValidateIdPipe) postId: number,
    @Body() updateImagePostBodyDTO: UpdateImagePostBodyDTO,
    @Req() req: Request,
  ): Promise<ImagePostResponseDTO> {
    const imagePost = await this.postService.findImagePostById(postId);

    if (!imagePost) {
      throw new NotFoundException(
        `${imagePost.Id}번에 해당하는 갤러리가 존재하지 않습니다.`,
      );
    }

    const requestUserId = req.user.Id;

    if (imagePost.userId !== requestUserId) {
      throw new UnauthorizedException(`유효하지 않은 접근입니다.`);
    }

    const newImagePost = await this.postService.updateImagePost(
      imagePost,
      updateImagePostBodyDTO,
    );

    if (!newImagePost) {
      throw new NotFoundException(
        `${newImagePost.Id}번에 해당하는 갤러리가 존재하지 않습니다.`,
      );
    }

    const imageList = await this.imageService.makeImageList(newImagePost.Id);
    if (!imageList) {
      throw new NotFoundException(`갤러리에 이미지가 존재하지 않습니다.`);
    }
    const firstImage = imageList[0];

    await this.imageService.setRepresentative(firstImage.Id);

    return new ImagePostResponseDTO(newImagePost);
  }

  @Delete('image/:postId/:imageId')
  @UseGuards(OnlyMemberGuard)
  async deleteImage(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('imageId', ValidateIdPipe) imageId: number,
    @Req() req: Request,
  ) {
    const requestUserId = req.user.Id;

    const postWithImages = await this.postService.findImagePostById(postId);
    if (!postWithImages) {
      throw new NotFoundException(
        `${postWithImages.Id}번에 해당하는 갤러리가 존재하지 않습니다.`,
      );
    }

    if (postWithImages.userId !== requestUserId) {
      throw new UnauthorizedException(`유효하지 않은 접근입니다.`);
    }

    const image = await this.imageService.findImageById(postId, imageId);
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

    return { result: true };
  }
}
