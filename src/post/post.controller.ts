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
  ImATeapotException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

import { POST_TYPE } from '../constants';
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
import { GetPostListResponseDTO } from './dto/get-post-list-response.dto';
import { CreateImagesBodyDTO } from '../image/dto/create-images-body.dto';
import { EditCommentBodyDTO } from '../comment/dto/edit-comment-body.dto';
import { CommentLikeService } from '../comment-like/comment-like.service';
import { ImageListResponseDTO } from '../image/dto/image-list-response.dto';
import { CommentReplyService } from '../comment-reply/comment-reply.service';
import { CreateCommentBodyDTO } from '../comment/dto/create-comment-body.dto';
import { GetCommentResponseDTO } from '../comment/dto/get-comment-response.dto';
import { GetCommentListResponseDTO } from '../comment/dto/get-comment-list-response.dto';

@Controller('post')
export class PostController {
  public constructor(
    private readonly postService: PostService,
    private readonly postLikeService: PostLikeService,
    private readonly commentService: CommentService,
    private readonly commentLikeService: CommentLikeService,
    private readonly commentReplyService: CommentReplyService,
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
  async getPostLikeOfUser(
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
  async updatePostLikes(
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
    @Query('type') type: POST_TYPE,
    @Query('page', ValidateIdPipe) page: number = 1,
  ): Promise<GetPostListResponseDTO> {
    if (type === POST_TYPE.GALLERY) {
      const [posts, count] = await this.postService.findPostsWtihImagesByPage(
        page,
        type,
      );

      if (!posts.length) {
        throw new NotFoundException(`${page} 페이지가 존재하지 않습니다.`);
      }

      return new GetPostListResponseDTO(posts, count);
    }
    const [posts, count] = await this.postService.findPostsByPage(page, type);

    if (!posts.length) {
      throw new NotFoundException(`${page} 페이지가 존재하지 않습니다.`);
    }

    return new GetPostListResponseDTO(posts, count);
  }

  /////////////////////////////////////한 포스트의 이미지리스트///////////////////////////////////////////
  @Get(':Id/images')
  @UseGuards(OnlyMemberGuard)
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
    //삭제
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

  @Post(':Id/images')
  @UseGuards(OnlyMemberGuard)
  async uploadImages(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() createImagesBodyDTO: CreateImagesBodyDTO,
    @Req() req: Request,
  ): Promise<ImageEntity[]> {
    const post = await this.postService.findPostById(Id);

    if (!post) {
      throw new NotFoundException(
        `${Id}번에 해당하는 Post가 존재하지 않습니다.`,
      );
    }

    const requestUserId = req.user.Id;

    if (post.userId !== requestUserId) {
      throw new UnauthorizedException(`유효하지 않은 접근입니다.`);
    }

    if (!post.status) {
      throw new NotFoundException(`${Id}번에 해당하는 Post가 삭제되었습니다.`);
    }

    if (!createImagesBodyDTO.images.length) {
      throw new ImATeapotException(`사진 안받았는데?`);
    }
    const images = await this.imageService.uploadImages(
      createImagesBodyDTO.images,
      Id,
    );

    if (!images) {
      throw new NotFoundException(`이미지 로딩에 실패했습니다.`);
    }

    if (post.type === POST_TYPE.GALLERY) {
      const firstImage = images[0];
      await this.imageService.setRepresentative(firstImage.Id);
    }

    const newImages = this.imageService.findImagesInPost(Id);

    return newImages;
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

    if (postWithImages.type === POST_TYPE.GALLERY) {
      const imageList = await this.imageService.findImagesInPost(postId);
      if (imageList.length > 0) {
        const firstImage = imageList[0];
        await this.imageService.setRepresentative(firstImage.Id);
      }
    }

    return { result: true };
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

    await this.postService.incrementCommentsCount(Id);

    return new GetCommentResponseDTO(comment);
  }

  @Put(':postId/comment/:commentId')
  @UseGuards(OnlyMemberGuard)
  async editComment(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('commentId', ValidateIdPipe) commentId: number,
    @Body() editCommentBodyDTO: EditCommentBodyDTO,
    @Req() request: Request,
  ): Promise<GetCommentResponseDTO> {
    const comment = await this.commentService.findCommentById(commentId);

    if (!comment) {
      throw new NotFoundException(
        `${commentId}번 Comment가 존재하지 않습니다.`,
      );
    }

    if (!comment.status) {
      throw new NotAcceptableException('삭제된 Comment입니다.');
    }

    if (comment.postId != postId) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    if (comment.userId !== request.user.Id) {
      throw new UnauthorizedException('유효하지 않은 접근입니다.');
    }

    const newComment = await this.commentService.editComment(
      comment,
      editCommentBodyDTO,
    );

    return new GetCommentResponseDTO(newComment);
  }

  @Delete(':postId/comment/:commentId')
  @UseGuards(OnlyMemberGuard)
  async deleteComment(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('commentId', ValidateIdPipe) commentId: number,
    @Req() request: Request,
  ) {
    const comment = await this.commentService.findCommentById(commentId);

    if (!comment) {
      throw new NotFoundException(
        `${commentId}번 Comment가 존재하지 않습니다.`,
      );
    }

    if (!comment.status) {
      throw new NotAcceptableException('삭제된 Comment입니다.');
    }

    if (comment.postId != postId) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    if (comment.userId !== request.user.Id) {
      throw new UnauthorizedException('유효하지 않은 접근입니다.');
    }

    try {
      this.commentService.deleteComment(commentId);
    } catch (e) {
      return { result: false };
    }

    await this.postService.decrementCommentsCount(postId);

    return { result: true };
  }

  @Get(':postId/comment/:commentId/like')
  @UseGuards(OnlyMemberGuard)
  async getCommentLikeOfUser(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('commentId', ValidateIdPipe) commentId: number,
    @Req() request: Request,
  ): Promise<boolean> {
    const comment = await this.commentService.findCommentById(commentId);

    if (!comment) {
      throw new NotFoundException(
        `${commentId}번 Comment가 존재하지 않습니다.`,
      );
    }

    if (!comment.status) {
      throw new NotAcceptableException('삭제된 Comment입니다.');
    }

    const isLiked = await this.commentLikeService.checkUserLikedComment(
      comment.Id,
      request.user.Id,
    );

    return isLiked;
  }

  @Post(':postId/comment/:commentId/like')
  @UseGuards(OnlyMemberGuard)
  async updateCommentLikes(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('commentId', ValidateIdPipe) commentId: number,
    @Req() request: Request,
  ) {
    const comment = await this.commentService.findCommentById(commentId);

    if (!comment) {
      throw new NotFoundException(
        `${commentId}번 Comment가 존재하지 않습니다.`,
      );
    }

    if (!comment.status) {
      throw new NotAcceptableException('삭제된 Comment입니다.');
    }

    const toggleResult = await this.commentLikeService.toggleLikes(
      comment.Id,
      request.user.Id,
    );

    try {
      toggleResult
        ? this.commentService.incrementLikes(commentId)
        : this.commentService.decrementLikes(commentId);
    } catch (e) {
      return { return: false };
    }

    return { return: true };
  }

  @Post(':postId/comment/:commentId/reply')
  @UseGuards(OnlyMemberGuard)
  async createReply(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('commentId', ValidateIdPipe) commentId: number,
    @Body() createCommentBodyDTO: CreateCommentBodyDTO,
    @Req() request: Request,
  ): Promise<GetCommentResponseDTO> {
    const comment = await this.commentService.findCommentById(commentId);

    if (!comment) {
      throw new NotFoundException(
        `${commentId}번 Comment가 존재하지 않습니다.`,
      );
    }

    if (!comment.status) {
      throw new NotAcceptableException('삭제된 Comment입니다.');
    }

    if (comment.postId != postId) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    const userId = request.user.Id;
    const isReply = true;

    const reply = await this.commentService.createComment(
      postId,
      userId,
      createCommentBodyDTO,
      isReply,
    );

    this.commentReplyService.addParentChildRelation(commentId, reply.Id);

    await this.postService.incrementCommentsCount(postId);

    return new GetCommentResponseDTO(reply);
  }

  @Get(':postId/comment/:commentId/reply')
  @UseGuards(OnlyMemberGuard)
  async loadAllReplies(
    @Param('postId', ValidateIdPipe) postId: number,
    @Param('commentId', ValidateIdPipe) commentId: number,
  ): Promise<GetCommentListResponseDTO> {
    const comment = await this.commentService.findCommentById(commentId);

    if (!comment) {
      throw new NotFoundException(
        `${commentId}번 Comment가 존재하지 않습니다.`,
      );
    }

    if (comment.postId != postId) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    const replies = await this.commentService.findRepliesByCommentId(commentId);

    return new GetCommentListResponseDTO(replies);
  }
}
