import { IsNumber, IsEmpty } from 'class-validator';

export class AttendanceRequestDTO {
  @IsEmpty()
  public userProjectId: number;
  public readonly attendanceTypeId: number;
  public readonly description: string;
}
