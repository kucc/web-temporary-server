import { IsNotEmpty, Length, Max, IsNumber, IsEmpty } from 'class-validator';

export class ProjectRequestDTO {
  @IsNotEmpty()
  @Length(100)
  public readonly title: string;

  @IsNotEmpty()
  @Length(100)
  public readonly place: string;

  @IsNumber()
  @Max(50)
  public readonly maxAttendance: number;

  @IsEmpty()
  public userId: number;
}
