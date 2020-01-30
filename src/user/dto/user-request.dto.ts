import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly nickname: string;

  @IsNotEmpty()
  public readonly password: string;

  @IsNotEmpty()
  public readonly description: string;
}
