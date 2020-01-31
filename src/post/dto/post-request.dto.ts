import { IsNotEmpty } from 'class-validator';

export class PostRequestDTO {
  @IsNotEmpty()
  public readonly title: string;

  @IsNotEmpty()
  public readonly content: string;

  @IsNotEmpty()
  public readonly postTypeId: number;
}
