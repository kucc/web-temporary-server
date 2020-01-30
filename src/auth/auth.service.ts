import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { LoginFormDTO } from './dto/login-form.dto';
import { UserEntity } from '../user/user.entity';
import { Bcrypt } from '../common/lib/bcrypt';

@Injectable()
export class AuthService {
  public async login(loginFormDTO: LoginFormDTO) {}

  public async createAccessToken() {
    const accessToken = jwt.sign('hello', process.env.JWT_SECRET, {
      expiresIn: Number(process.env.JWT_EXPIRATION),
    });

    return accessToken;
  }

  public async checkPassword(user: UserEntity, password: string) {
    const isPasswordCorrect = await Bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      return true;
    }

    return false;
  }
}
