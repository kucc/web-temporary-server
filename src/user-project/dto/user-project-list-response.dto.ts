import { UserProjectEntity } from '../user-project.entity';

export class UserProjectListResponseDTO {
  public constructor(userProjects: UserProjectEntity[]) {
    this.count = userProjects.length;
    this.data = userProjects.map(userProject => {
      return {
        Id: userProject.Id,
        userId: userProject.userId,
        attend: userProject.attend,
        late: userProject.late,
        absent: userProject.absent,
        noticedAbsent: userProject.noticedAbsent,
      };
    });
  }
  public readonly count: number;
  public readonly data: object;
}
