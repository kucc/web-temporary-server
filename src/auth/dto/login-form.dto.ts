import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginFormDTO {
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsNotEmpty()
  public readonly password: string;
}
