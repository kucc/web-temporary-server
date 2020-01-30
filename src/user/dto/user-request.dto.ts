import { IsEmail, IsNotEmpty, IsEmpty } from 'class-validator';

export class UserRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly nickname: string;

  @IsNotEmpty()
  public password: string;

  public readonly description: string;

  @IsEmpty()
  public salt: string;
}
