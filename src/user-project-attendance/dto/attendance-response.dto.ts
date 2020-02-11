import { AttendanceEntity } from '../user-project-attendance.entity';

export class AttendanceResponseDTO {
  public constructor(userProjectAttendace: AttendanceEntity) {
    this.Id = userProjectAttendace.Id;
    this.createdAt = userProjectAttendace.createdAt;
    this.userProjectId = userProjectAttendace.userProjectId;
    this.description = userProjectAttendace.description;
  }

  public readonly Id: number;
  public readonly createdAt: string;
  public readonly userProjectId: number;
  public readonly description: string;
  public readonly status: boolean;
}
