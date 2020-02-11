import { AttendanceEntity } from '../user-project-attendance.entity';

export class AttendanceResponseDTO {
  public constructor(attendace: AttendanceEntity) {
    this.Id = attendace.Id;
    this.createdAt = attendace.createdAt;
    this.userProjectId = attendace.userProjectId;
    this.description = attendace.description;
    this.attendanceTypeId = attendace.attendanceTypeId;
  }
  public readonly Id: number;
  public readonly createdAt: string;
  public readonly userProjectId: number;
  public readonly attendanceTypeId: number;
  public readonly description: string;
}
