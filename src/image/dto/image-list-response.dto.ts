import { ImageEntity } from '../image.entity';
import { ImageResponseDTO } from './image-response.dto';

export class ImageListResponseDTO {
  public constructor(images: ImageEntity[]) {
    this.count = images.length;
    this.data = images.map(image => {
      return new ImageResponseDTO(image);
    });
  }
  public readonly count: number;
  public readonly data: object;
}
