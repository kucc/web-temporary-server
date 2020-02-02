import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

import { Bcrypt } from '../common/lib/bcrypt';
import { UserEntity } from '../user/user.entity';
import { LoginFormDTO } from './dto/login-form.dto';
import { UserResponseDTO } from '../user/dto/user-response.dto';

@Injectable()
export class AuthService {
  public async login(loginFormDTO: LoginFormDTO) {}

  public async createAccessToken(user: UserEntity) {
    const userResponse = new UserResponseDTO(user);

    const accessToken = jwt.sign(
      { data: userResponse },
      process.env.JWT_SECRET,
      {
        expiresIn: number(process.env.JWT_EXPIRATION),
      },
    );

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
