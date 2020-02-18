import { IsNotEmpty, IsEmpty } from 'class-validator';

export class CreateImageBodyDTO {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly url: string;

  @IsEmpty()
  public postId: number;
}
