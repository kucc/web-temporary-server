import { IsNotEmpty, Max, IsNumber, MaxLength } from 'class-validator';

export class UpdateProjectRequestDTO {
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @IsNotEmpty()
  @MaxLength(100)
  public readonly place: string;

  @IsNumber()
  @Max(50)
  public readonly maxAttendance: number;

  @MaxLength(100)
  public readonly avatar: string;

  @IsNotEmpty()
  @MaxLength(100)
  public readonly season: string;
}
