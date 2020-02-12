import { UserProjectEntity } from '../user-project.entity';

export class UserProjectResponseDTO {
  public constructor(userProject: UserProjectEntity) {
    this.Id = userProject.Id;
    this.userId = userProject.userId;
    this.projectId = userProject.projectId;
    this.absent = userProject.absent;
    this.late = userProject.late;
    this.attend = userProject.attend;
    this.noticedAbsent = userProject.noticedAbsent;
    this.totalLate = userProject.totalLate;
  }
  public readonly Id: number;
  public readonly userId: number;
  public readonly projectId: number;
  public readonly attend: number;
  public readonly late: number;
  public readonly absent: number;
  public readonly noticedAbsent: number;
  public readonly totalLate: number;
}
