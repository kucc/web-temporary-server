import { IsEmpty, IsNumber } from 'class-validator';

export class UserProjectRequestDTO {
  @IsEmpty()
  public userId: number;
}
