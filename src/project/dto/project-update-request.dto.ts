import { IsNotEmpty, Length, Max, IsNumber } from 'class-validator';

export class UpdateProjectRequestDTO {
  @IsNotEmpty()
  @Length(100)
  public readonly title: string;

  @IsNotEmpty()
  @Length(100)
  public readonly place: string;

  @IsNumber()
  @Max(50)
  public readonly maxAttendance: number;
}
