import { IsNotEmpty, IsNumber, IsEmpty, MaxLength } from 'class-validator';

export class CreatePostBodyDTO {
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @IsNotEmpty()
  public readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  public readonly postTypeId: number;

  @IsEmpty()
  public userId: number;
}
