import { AttendanceEntity } from '../user-project-attendance.entity';

export class AttendanceListResponseDTO {
  public constructor(attendances: AttendanceEntity[]) {
    this.count = attendances.length;
    this.data = attendances.map(attendance => {
      return {
        Id: attendance.Id,
        createdAt: attendance.createdAt,
        description: attendance.description,
      };
    });
  }

  public readonly count: number;
  public readonly data: object;
}
