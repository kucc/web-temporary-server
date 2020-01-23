import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  public getUser(): string {
    return 'user';
  }

  public findUserById(Id: Number): string {
    return `User ${Id}`;
  }
}
