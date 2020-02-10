import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserProjectEntity } from './user-project.entity';
import { ProjectEntity } from '../project/project.entity';
import { UserProjectRequestDTO } from './dto/user-project-request.dto';
import { UpdateUserProjectRequestDTO } from './dto/user-project-update-request.dto';

@Injectable()
export class UserProjectService {
  public constructor(
    @InjectRepository(UserProjectEntity)
    private readonly userProjectRepository: Repository<UserProjectEntity>,
  ) {}

  public async findUserProjectById(
    projectId: number,
    userId: number,
  ): Promise<UserProjectEntity> {
    const userProject = await this.userProjectRepository.findOne({
      where: {
        userId,
        projectId,
        status: true,
      },
    });

    return userProject;
  }

  public async getUserList(
    project: ProjectEntity,
  ): Promise<UserProjectEntity[]> {
    const projectId = project.Id;

    const userList = await this.userProjectRepository.find({
      where: {
        projectId,
        status: true,
      },
      order: {
        userId: 'ASC',
      },
    });

    return userList;
  }

  public async createUserProject(
    userId: number,
    projectId: number,
    userProjectRequestDTO: UserProjectRequestDTO,
  ): Promise<UserProjectEntity> {
    userProjectRequestDTO.projectId = projectId;
    userProjectRequestDTO.userId = userId;

    const userProject = this.userProjectRepository.create(
      userProjectRequestDTO,
    );
    await this.userProjectRepository.save(userProject);

    return userProject;
  }

  public async updateUserProject(
    userProject: UserProjectEntity,
    updateUserProjectRequestDTO: UpdateUserProjectRequestDTO,
  ): Promise<UserProjectEntity> {
    const newUserProject = this.userProjectRepository.merge(
      userProject,
      updateUserProjectRequestDTO,
    );

    await this.userProjectRepository.save(newUserProject);

    return newUserProject;
  }

  public async deleteUserProject(userProject: UserProjectEntity) {
    userProject.status = false;
    await this.userProjectRepository.save(userProject);
  }
}
