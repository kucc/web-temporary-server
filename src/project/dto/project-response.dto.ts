import { ProjectEntity } from '../project.entity';

export class ProjectResponseDTO {
  public constructor(project: ProjectEntity) {
    this.Id = project.Id;
    this.title = project.title;
    this.place = project.place;
    this.maxAttendance = project.maxAttendance;
    this.userId = project.userId;
  }
  public readonly Id: Number;
  public readonly createdAt: Date;
  public readonly title: string;
  public readonly place: string;
  public readonly maxAttendance: Number;
  public readonly userId: Number;
}
