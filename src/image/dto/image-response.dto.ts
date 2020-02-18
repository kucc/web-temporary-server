import { ImageEntity } from '../image.entity';

export class ImageResponseDTO {
  public constructor(image: ImageEntity) {
    this.Id = image.Id;
    this.name = image.name;
    this.postId = image.postId; //보류
    this.url = image.url;
    this.isRepresentative = image.isRepresentative;
  }

  public readonly Id: number;
  public readonly name: string;
  public readonly url: string;
  public readonly postId: number;
  public readonly isRepresentative: boolean;
}
