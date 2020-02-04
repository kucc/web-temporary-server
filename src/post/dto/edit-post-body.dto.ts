import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class EditPostBodyDTO {
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @IsNotEmpty()
  public readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  public readonly postTypeId: number;
}
