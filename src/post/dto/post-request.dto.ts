import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostRequestDTO {
  @IsNotEmpty()
  public readonly title: string;

  @IsNotEmpty()
  public readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  public readonly postTypeId: number;
}
