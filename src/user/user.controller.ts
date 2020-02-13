import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  Put,
  UseGuards,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { PostService } from '../post/post.service';
import { UserRequestDTO } from './dto/user-request.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { UserUpdateRequestDTO } from './dto/user-update-request.dto';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { VerifyEmailRequestDTO } from './dto/verify-email-request.dto';
import { GetPostListResponseDTO } from '../post/dto/get-post-list-response.dto';

@Controller('user')
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Post('/signup')
  async signUp(
    @Body() userRequestDTO: UserRequestDTO,
  ): Promise<UserResponseDTO> {
    // TODO : 이메일 요청 전송
    const User = await this.userService.createUser(userRequestDTO);
    return new UserResponseDTO(User);
  }

  @Post('/email-verification')
  async verifyEmail(@Body() verifyEmailRequestDTO: VerifyEmailRequestDTO) {
    const user = await this.userService.findUserByEmail(
      verifyEmailRequestDTO.email,
    );

    if (!user) {
      return { result: true };
    }

    return { result: false };
  }

  @Get('/:Id/post')
  async getPostByUserId(
    @Param('Id', ValidateIdPipe) Id: number,
    @Query('page', ValidateIdPipe) page: number = 1,
  ) {
    const user = await this.userService.findUserById(Id);

    if (!user) {
      throw new NotFoundException(
        `${Id}번 Id를 갖는 회원이 존재하지 않습니다.`,
      );
    }

    const [posts, count] = await this.postService.findPostsByUserId(Id, page);

    if (!posts.length) {
      throw new NotFoundException(`${page} 페이지가 존재하지 않습니다.`);
    }

    return new GetPostListResponseDTO(posts, count);
  }

  @Get('/:Id')
  async getUserById(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<UserResponseDTO> {
    const user = await this.userService.findUserById(Id);

    if (!user) {
      throw new NotFoundException(
        `${Id}번 Id를 갖는 회원이 존재하지 않습니다.`,
      );
    }

    return new UserResponseDTO(user);
  }

  @Put('/:Id')
  @UseGuards(OnlyMemberGuard)
  async updateUser(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() userUpdateRequestDTO: UserUpdateRequestDTO,
    @Req() request: Request,
  ): Promise<UserResponseDTO> {
    const user = await this.userService.findUserById(Id);

    if (!user) {
      throw new NotFoundException(
        `${Id}번 Id를 갖는 회원이 존재하지 않습니다.`,
      );
    }

    if (request.user.Id !== user.Id) {
      throw new BadRequestException(
        `올바르지 않은 요청입니다. 혹시 당신은 해커? 건들지마라 우리 사이트..`,
      );
    }

    const updatedUser = await this.userService.updateUser(
      user,
      userUpdateRequestDTO,
    );

    return new UserResponseDTO(updatedUser);
  }
}
