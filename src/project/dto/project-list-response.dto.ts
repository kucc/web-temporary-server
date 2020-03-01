import { ProjectEntity } from '../project.entity';
import { ProjectResponseDTO } from './project-response.dto';

export class ProjectListResponseDTO {
  public constructor(projects: ProjectEntity[]) {
    this.data = projects.map(project => {
      return new ProjectResponseDTO(project);
    });
    this.count = projects.length;
  }
  public readonly data: object;
  public readonly count: number;
}
