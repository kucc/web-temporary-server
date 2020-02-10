import { UserProjectEntity } from '../user-project.entity';

export class UserProjectListResponseDTO {
  public constructor(userProjects: UserProjectEntity[]) {
    this.count = userProjects.length;
    this.data = userProjects.map(userProject => {
      return {
        Id: userProject.Id,
        userId: userProject.userId,
        attendance: userProject.attendance,
        late: userProject.late,
        absence: userProject.absense,
      };
    });
  }
  public readonly count: number;
  public readonly data: object;
}
