import { IsNotEmpty, Length, Max } from 'class-validator';

export class ProjectRequestDTO {
  @IsNotEmpty()
  @Length(100)
  readonly title: string;

  @IsNotEmpty()
  @Length(100)
  readonly place: string;

  @IsNotEmpty()
  @Max(50)
  readonly maxAttendance: number;

  @IsNotEmpty()
  readonly userId: number;
}
