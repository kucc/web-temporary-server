import { NestMiddleware, Injectable } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { UserResponseDTO } from '../../user/dto/user-response.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserResponseDTO;
    }
  }
}

@Injectable()
export class DeserializeUserMiddleWare implements NestMiddleware {
  public async use(
    request: Request,
    response: Response,
    next: Function,
  ): Promise<void> {
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
      return next();
    }

    try {
      const { data }: any = jwt.verify(accessToken, process.env.JWT_SECRET);

      if (data) {
        request.user = data;
      }
    } catch (e) {
      response.clearCookie('accessToken');
    }

    return next();
  }
}
