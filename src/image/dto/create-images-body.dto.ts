import { CreateImageBodyDTO } from './create-image-body.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateImagesBodyDTO {
  @IsNotEmpty()
  public readonly images: CreateImageBodyDTO[];
}
