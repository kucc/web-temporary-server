import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';

import { UserService } from './user.service';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserRequestDTO } from './dto/user-request.dto';
import { VerifyEmailRequestDTO } from './dto/verify-email-request.dto';

@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post('')
  async signUp(
    @Body() userRequestDTO: UserRequestDTO,
  ): Promise<UserResponseDTO> {
    const User = await this.userService.createUser(userRequestDTO);
    return new UserResponseDTO(User);
  }

  @Post('/email-verification')
  async verifyEmail(@Body() verifyEmailRequestDTO: VerifyEmailRequestDTO) {
    const User = await this.userService.findUserByEmail(
      verifyEmailRequestDTO.email,
    );

    if (!User) {
      return { result: true };
    }

    return { result: false };
  }

  @Get('/:Id')
  async getUserById(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<UserResponseDTO> {
    const User = await this.userService.findUserById(Id);

    if (!User) {
      throw new NotFoundException(
        `${Id}번 Id를 갖는 회원이 존재하지 않습니다.`,
      );
    }

    return new UserResponseDTO(User);
  }
}
