import { IsNotEmpty } from 'class-validator';

export class EditCommentBodyDTO {
  @IsNotEmpty()
  public readonly content: string;
}
