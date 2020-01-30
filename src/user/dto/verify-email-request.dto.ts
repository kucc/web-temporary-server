import { IsEmail } from 'class-validator';

export class VerifyEmailRequestDTO {
  @IsEmail()
  public readonly email: string;
}
