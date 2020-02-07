import { IsNotEmpty, MaxLength, IsInt } from 'class-validator';

export class EditPostBodyDTO {
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @IsNotEmpty()
  public readonly content: string;

  @IsInt()
  @IsNotEmpty()
  public readonly postTypeId: number;
}
