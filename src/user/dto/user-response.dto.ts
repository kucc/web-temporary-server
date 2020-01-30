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
  public readonly Id: Number;
  public readonly email: String;
  public readonly name: String;
  public readonly nickname: String;
  public readonly isAdmin: boolean;
  public readonly description: String;
}