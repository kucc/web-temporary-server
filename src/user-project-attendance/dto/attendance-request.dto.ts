import { IsNumber, IsEmpty, IsNotEmpty, Max } from 'class-validator';
import { ATTENDANCE_TYPE } from '../../constants';

export class AttendanceRequestDTO {
  @IsEmpty()
  public userProjectId: number;

  @IsNotEmpty()
  public readonly type: ATTENDANCE_TYPE;

  @IsNumber()
  @Max(20)
  public readonly lateTime: number;

  @IsNotEmpty()
  public readonly publishedAt: string;

  public readonly description: string;
}
