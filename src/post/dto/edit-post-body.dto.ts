import { IsNotEmpty, MaxLength, IsInt } from 'class-validator';
import { POST_TYPE } from '../../constants';

export class EditPostBodyDTO {
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @IsNotEmpty()
  public readonly content: string;

  @IsNotEmpty()
  public readonly type: POST_TYPE;
}
