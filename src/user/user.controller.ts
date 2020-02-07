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
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { UserRequestDTO } from './dto/user-request.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { UserUpdateRequestDTO } from './dto/user-update-request.dto';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { VerifyEmailRequestDTO } from './dto/verify-email-request.dto';

@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(
    @Body() userRequestDTO: UserRequestDTO,
  ): Promise<UserResponseDTO> {
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
