import { ProjectEntity } from '../project.entity';

export class ProjectResponseDTO {
  public constructor(project: ProjectEntity) {
    this.Id = project.Id;
    this.createdAt = project.createdAt;
    this.title = project.title;
    this.place = project.place;
    this.maxAttendance = project.maxAttendance;
    this.avatar = project.avatar;
    this.season = project.season;
    this.userId = project.userId;
  }
  public readonly Id: number;
  public readonly createdAt: string;
  public readonly title: string;
  public readonly place: string;
  public readonly maxAttendance: number;
  public readonly avatar: string;
  public readonly season: string;
  public readonly userId: number;
}
