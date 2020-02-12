import { AttendanceEntity } from '../user-project-attendance.entity';

export class AttendanceResponseDTO {
  public constructor(attendance: AttendanceEntity) {
    this.Id = attendance.Id;
    this.publishedAt = attendance.publishedAt;
    this.userProjectId = attendance.userProjectId;
    this.description = attendance.description;
    this.type = attendance.type;
  }
  public readonly Id: number;
  public readonly publishedAt: string;
  public readonly userProjectId: number;
  public readonly type: string;
  public readonly description: string;
}
