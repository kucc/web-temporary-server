import { IsEmpty } from 'class-validator';

export class UserProjectRequestDTO {
  @IsEmpty()
  public userId: number;

  @IsEmpty()
  public projectId: number;
}
