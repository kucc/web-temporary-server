import { IsNotEmpty, Max, IsNumber, IsEmpty, MaxLength } from 'class-validator';

export class ProjectRequestDTO {
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @IsNotEmpty()
  @MaxLength(100)
  public readonly place: string;

  @IsNumber()
  @Max(50)
  public readonly maxAttendance: number;

  @IsEmpty()
  public userId: number;
}
