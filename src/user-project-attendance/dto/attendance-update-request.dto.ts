import { IsNotEmpty } from 'class-validator';
import { ATTENDANCE_TYPE } from '../../constants';

export class UpdateAttendanceRequestDTO {
  @IsNotEmpty()
  public readonly publishedAt: string;

  @IsNotEmpty()
  public readonly type: ATTENDANCE_TYPE;

  public readonly description: string;
}
