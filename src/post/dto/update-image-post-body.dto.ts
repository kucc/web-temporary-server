import { IsNotEmpty, MaxLength, IsEmpty } from 'class-validator';
import { ImageEntity } from '../../image/image.entity';

export class UpdateImagePostBodyDTO {
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  public readonly content: string;
}
