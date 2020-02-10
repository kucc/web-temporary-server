import { UserProjectEntity } from '../user-project.entity';

export class UserProjectResponseDTO {
  public constructor(userProject: UserProjectEntity) {
    this.Id = userProject.Id;
    this.userId = userProject.userId;
    this.projectId = userProject.projectId;
    this.absense = userProject.absense;
    this.late = userProject.late;
    this.attendance = userProject.attendance;
  }
  public readonly Id: number;
  public readonly userId: number;
  public readonly projectId: number;
  public readonly attendance: number;
  public readonly late: number;
  public readonly absense: number;
}
