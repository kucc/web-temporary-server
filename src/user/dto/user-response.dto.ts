import { UserEntity } from '../user.entity';

export class UserResponseDTO {
  public constructor(user: UserEntity) {
    this.Id = user.Id;
    this.email = user.email;
    this.name = user.name;
    this.nickname = user.nickname;
    this.isAdmin = user.isAdmin;
    this.description = user.description;
  }
  public readonly Id: number;
  public readonly email: string;
  public readonly name: string;
  public readonly nickname: string;
  public readonly isAdmin: boolean;
  public readonly description: string;
}
