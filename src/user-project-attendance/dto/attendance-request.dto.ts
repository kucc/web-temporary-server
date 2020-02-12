import { IsNumber, IsEmpty, IsNotEmpty } from 'class-validator';
import { ATTENDANCE_TYPE } from '../../constants';

export class AttendanceRequestDTO {
  @IsEmpty()
  public userProjectId: number;

  @IsNotEmpty()
  public readonly type: ATTENDANCE_TYPE;

  @IsNotEmpty()
  public readonly publishedAt: string;

  public readonly description: string;
}
