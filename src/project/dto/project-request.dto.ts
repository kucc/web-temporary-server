import { IsNotEmpty, Length, Max, IsNumber } from 'class-validator';

export class ProjectRequestDTO {
  @IsNotEmpty()
  @Length(100)
  readonly title: string;

  @IsNotEmpty()
  @Length(100)
  readonly place: string;

  @IsNumber()
  @Max(50)
  readonly maxAttendance: number;

  @IsNumber()
  readonly userId: number;
}
