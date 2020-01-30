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

@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('hello')
  async getAllUser() {
    return await this.userService.findAllUser();
  }

  @Get('/:Id')
  async getUserById(@Param('Id', ValidateIdPipe) Id: Number) {
    const User = await this.userService.findUserById(Id);

    if (!User) {
      throw new NotFoundException(
        `${Id}번 Id를 갖는 회원이 존재하지 않습니다.`,
      );
    }

    return new UserResponseDTO(User);
  }
}
