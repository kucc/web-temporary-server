import { AttendanceEntity } from '../user-project-attendance.entity';

export class AttendanceListResponseDTO {
  public constructor(attendances: AttendanceEntity[]) {
    this.count = attendances.length;
    this.data = attendances.map(attendance => {
      return {
        Id: attendance.Id,
        publishedAt: attendance.publishedAt,
        description: attendance.description,
        type: attendance.type,
      };
    });
  }

  public readonly count: number;
  public readonly data: object;
}
