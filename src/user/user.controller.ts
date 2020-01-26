import { Controller, Get, Post, Param, Body } from '@nestjs/common';

import { UserService } from './user.service';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';

@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('hello')
  getAllUser() {
    return this.userService.findAllUser();
  }

  @Get(':Id')
  getUserById(@Param('Id', ValidateIdPipe) Id: Number) {
    return this.userService.findUserById(Id);
  }
}
