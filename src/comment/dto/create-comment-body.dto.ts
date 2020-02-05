import { IsNotEmpty, IsEmpty } from 'class-validator';

export class CreateCommentBodyDTO {
  @IsNotEmpty()
  public readonly content: string;

  @IsEmpty()
  public postId: number;

  @IsEmpty()
  public userId: number;
}
