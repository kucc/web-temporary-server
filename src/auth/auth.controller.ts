import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LoginFormDTO } from './dto/login-form.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  async login(@Body() loginFormDTO: LoginFormDTO, @Res() response: Response) {
    const user = await this.userService.findUserByEmail(loginFormDTO.email);

    if (!user) {
      throw new NotFoundException(
        `${loginFormDTO.email}의 이메일을 가진 회원이 존재하지 않습니다.`,
      );
    }

    const isPasswordMatch = await this.authService.checkPassword(
      user,
      loginFormDTO.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException(`비밀번호가 일치하지 않습니다`);
    }

    const accessToken = await this.authService.createAccessToken(user);
    response.cookie('accessToken', accessToken);

    response.json({
      result: true,
    });
  }

  @Get('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    response.clearCookie('accessToken');

    response.json({
      result: true,
    });
  }
}
