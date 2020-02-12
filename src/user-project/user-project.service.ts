import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserProjectEntity } from './user-project.entity';
import { ProjectEntity } from '../project/project.entity';
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

  public async findUserProjectByUserProjectId(
    Id: number,
  ): Promise<UserProjectEntity> {
    const userProject = await this.userProjectRepository.findOne({
      where: {
        Id,
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
  ): Promise<UserProjectEntity> {
    const userProject = this.userProjectRepository.create({
      userId,
      projectId,
    });

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

  public async deleteUserProject(Id: number) {
    await this.userProjectRepository.update(Id, { status: false });
    return { result: true };
  }

  public async incrementTotalAttendance(
    Id: number,
    type: string,
    lateTime: number,
  ) {
    await this.userProjectRepository.increment({ Id }, type, 1);
    await this.userProjectRepository.increment({ Id }, 'totalLate', lateTime);

    return { result: true };
  }

  public async decrementTotalAttendance(
    Id: number,
    type: string,
    lateTime: number,
  ) {
    await this.userProjectRepository.decrement({ Id }, type, 1);
    await this.userProjectRepository.decrement({ Id }, 'totalLate', lateTime);

    return { result: true };
  }

  public async updateAttendanceType(
    Id: number,
    oldType: string,
    newType: string,
  ) {
    await this.userProjectRepository.decrement({ Id }, oldType, 1);
    await this.userProjectRepository.increment({ Id }, newType, 1);

    return { result: true };
  }

  public async updateTotalLateTime(
    Id: number,
    oldLateTime: number,
    newLateTime: number,
  ) {
    await this.userProjectRepository.decrement(
      { Id },
      'totalLate',
      oldLateTime,
    );
    await this.userProjectRepository.increment(
      { Id },
      'totalLate',
      newLateTime,
    );

    return { result: true };
  }
}
