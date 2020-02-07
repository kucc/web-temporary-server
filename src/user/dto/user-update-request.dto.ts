import { IsNotEmpty } from 'class-validator';

export class UserUpdateRequestDTO {
  @IsNotEmpty()
  public readonly nickname: string;

  public readonly description: string;
}
