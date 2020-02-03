import { Injectable } from '@nestjs/common';
import { ProjectEntity } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectResponseDTO } from './dto/project-response.dto';
import { ProjectRequestDTO } from './dto/project-request.dto';
import { ProjectUpdateRequestDTO } from './dto/project-update-request.dto';

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
    projectUpdateRequestDTO: ProjectUpdateRequestDTO,
  ): Promise<ProjectEntity> {
    const Project = await this.findProjectById(Id);
    const newProject = this.projectRepository.merge(
      Project,
      projectUpdateRequestDTO,
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
