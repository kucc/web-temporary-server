import { IsUrl, IsNotEmpty } from 'class-validator';

export class UserAvatarUpdateRequestDTO {
  @IsUrl()
  @IsNotEmpty()
  public readonly avatar: string;
}
