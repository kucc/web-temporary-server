import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from './project.entity';
import { ProjectRequestDTO } from './dto/project-request.dto';
import { UpdateProjectRequestDTO } from './dto/project-update-request.dto';

@Injectable()
export class ProjectService {
  public constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  public async findProjectById(Id: number): Promise<ProjectEntity> {
    const Project = await this.projectRepository.findOne({
      where: {
        Id,
        status: true,
      },
    });

    return Project;
  }

  public async createNewProject(
    projectRequestDTO: ProjectRequestDTO,
    userId: number,
  ): Promise<ProjectEntity> {
    projectRequestDTO.userId = userId;
    const Project = this.projectRepository.create(projectRequestDTO);
    await this.projectRepository.save(Project);
    return Project;
  }

  public async updateProject(
    Id: number,
    updateProjectRequestDTO: UpdateProjectRequestDTO,
  ): Promise<ProjectEntity> {
    const Project = await this.findProjectById(Id);
    const newProject = this.projectRepository.merge(
      Project,
      updateProjectRequestDTO,
    );

    await this.projectRepository.save(newProject);
    return newProject;
  }

  public async deleteProjectById(Id: number) {
    const deletedProject = await this.findProjectById(Id);
    deletedProject.status = false;
    await this.projectRepository.save(deletedProject);
  }
}
