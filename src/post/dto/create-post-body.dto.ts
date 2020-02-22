import { IsNotEmpty, IsEmpty, MaxLength } from 'class-validator';
import { POST_TYPE } from '../../constants';

export class CreatePostBodyDTO {
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @IsNotEmpty()
  public readonly content: string;

  @IsNotEmpty()
  public readonly type: POST_TYPE;

  @IsEmpty()
  public userId: number;
}
