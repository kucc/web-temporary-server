import { IsNotEmpty } from 'class-validator';

export class ProjectRequestDTO {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly place: string;

  @IsNotEmpty()
  readonly maxAttendance: number;

  @IsNotEmpty()
  readonly userId: number;
}
