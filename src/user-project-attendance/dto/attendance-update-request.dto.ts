import { IsNotEmpty, IsNumber, Max } from 'class-validator';
import { ATTENDANCE_TYPE } from '../../constants';

export class UpdateAttendanceRequestDTO {
  @IsNotEmpty()
  public readonly publishedAt: string;

  @IsNotEmpty()
  public readonly type: ATTENDANCE_TYPE;

  @IsNumber()
  @Max(20)
  public readonly lateTime: number;

  public readonly description: string;
}
