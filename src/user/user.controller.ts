import { Controller, Get, Post, Param } from '@nestjs/common';

import { UserService } from './user.service';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';

@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('hello')
  getUser() {
    return this.userService.getUser();
  }

  @Get(':Id')
  getUserById(@Param('Id', ValidateIdPipe) Id: Number) {
    return this.userService.findUserById(Id);
  }
}
