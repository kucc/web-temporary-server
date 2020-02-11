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
    const project = await this.projectRepository.findOne({
      where: {
        Id,
        status: true,
      },
    });

    return project;
  }

  public async createNewProject(
    projectRequestDTO: ProjectRequestDTO,
    userId: number,
  ): Promise<ProjectEntity> {
    projectRequestDTO.userId = userId;
    const project = this.projectRepository.create(projectRequestDTO);
    await this.projectRepository.save(project);
    return project;
  }

  public async updateProject(
    project: ProjectEntity,
    updateProjectRequestDTO: UpdateProjectRequestDTO,
  ): Promise<ProjectEntity> {
    const newProject = this.projectRepository.merge(
      project,
      updateProjectRequestDTO,
    );

    await this.projectRepository.save(newProject);
    return newProject;
  }

  public async deleteProject(Id: number) {
    await this.projectRepository.update(Id, { status: false });
  }
}
