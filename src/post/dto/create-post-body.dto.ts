import { IsNotEmpty, IsNumber, IsEmpty } from 'class-validator';

export class CreatePostBodyDTO {
  @IsNotEmpty()
  public readonly title: string;

  @IsNotEmpty()
  public readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  public readonly postTypeId: number;

  @IsEmpty()
  public userId: number;
}
