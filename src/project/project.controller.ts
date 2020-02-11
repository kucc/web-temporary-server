import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from '../user/user.service';
import { ProjectService } from './project.service';
import { ProjectRequestDTO } from './dto/project-request.dto';
import { ProjectResponseDTO } from './dto/project-response.dto';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { UserProjectService } from '../user-project/user-project.service';
import { UpdateProjectRequestDTO } from './dto/project-update-request.dto';
import { UserProjectResponseDTO } from '../user-project/dto/user-project-response.dto';
import { UserProjectListResponseDTO } from '../user-project/dto/user-project-list-response.dto';
import { UpdateUserProjectRequestDTO } from '../user-project/dto/user-project-update-request.dto';

@Controller('project')
export class ProjectController {
  public constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly userProjectService: UserProjectService,
  ) {}

  @Get(':Id')
  @UseGuards(OnlyMemberGuard)
  async getProjectById(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<ProjectResponseDTO> {
    const project = await this.projectService.findProjectById(Id);

    if (!project) {
      throw new NotFoundException(
        `${Id}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }

    return new ProjectResponseDTO(project);
  }

  @Post('')
  @UseGuards(OnlyMemberGuard)
  async postProject(
    @Body() projectRequestDTO: ProjectRequestDTO,
    @Req() req: Request,
  ): Promise<ProjectResponseDTO> {
    const userId = req.user.Id;

    const project = await this.projectService.createNewProject(
      projectRequestDTO,
      userId,
    );

    return new ProjectResponseDTO(project);
  }

  @Put(':Id')
  @UseGuards(OnlyMemberGuard)
  async updateProjectById(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() updateProjectRequestDTO: UpdateProjectRequestDTO,
    @Req() req: Request,
  ): Promise<ProjectResponseDTO> {
    const userId = req.user.Id;

    const project = await this.projectService.findProjectById(Id);

    if (!project) {
      throw new NotFoundException(
        `Id가 ${Id}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException('유효하지 않은 접근입니다.');
    }

    const updatedProject = await this.projectService.updateProject(
      project,
      updateProjectRequestDTO,
    );

    return new ProjectResponseDTO(updatedProject);
  }

  @Delete(':Id')
  @UseGuards(OnlyMemberGuard)
  async deleteProjectById(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() req: Request,
  ) {
    const userId = req.user.Id;

    const project = await this.projectService.findProjectById(Id);
    if (!project) {
      throw new NotFoundException(
        `Id가 ${Id}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException('유효하지 않은 접근입니다.');
    }

    try {
      this.projectService.deleteProject(Id);
    } catch (e) {
      return { result: false };
    }

    return { result: true };
  }

  @Get(':projectId/user/:userId')
  @UseGuards(OnlyMemberGuard)
  async getUserProjectById(
    @Param('projectId', ValidateIdPipe) projectId: number,
    @Param('userId', ValidateIdPipe) userId: number,
    @Req() req: Request,
  ): Promise<UserProjectResponseDTO> {
    const project = await this.projectService.findProjectById(projectId);

    if (!project) {
      throw new NotFoundException(
        `ID가 ${projectId}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException(
        `ID가 ${userId}에 해당하는 사용자가 존재하지 않습니다.`,
      );
    }

    //출석률 공개 어찌함
    const requestUserId = req.user.Id;
    if (requestUserId !== userId && requestUserId !== project.userId) {
      throw new UnauthorizedException('유효한 접근이 아닙니다.');
    }

    const userProject = await this.userProjectService.findUserProjectById(
      projectId,
      userId,
    );

    if (!userProject) {
      throw new NotFoundException(
        `${userId}번 유저는 ${projectId}번 프로젝트에 참여하지 않습니다.`,
      );
    }

    return new UserProjectResponseDTO(userProject);
  }

  @Get(':projectId/user')
  @UseGuards(OnlyMemberGuard)
  async getUserList(
    @Param('projectId', ValidateIdPipe) projectId: number,
    @Req() req: Request,
  ): Promise<UserProjectListResponseDTO> {
    const project = await this.projectService.findProjectById(projectId);

    if (!project) {
      throw new NotFoundException(
        `ID가 ${projectId}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }

    const requestUserId = req.user.Id;

    if (requestUserId !== project.userId) {
      throw new UnauthorizedException('유효한 접근이 아닙니다.');
    }
    //세션 참여자는 누가 볼 수있는가...

    const userList = await this.userProjectService.getUserList(project);

    if (!userList) {
      throw new NotFoundException(
        `${projectId}번 프로젝트에 참여하는 유저를 불러오는데 실패했습니다.`,
      );
    }

    return new UserProjectListResponseDTO(userList);
  }

  @Post(':projectId/user/:userId')
  @UseGuards(OnlyMemberGuard)
  async createUserProject(
    @Param('projectId', ValidateIdPipe) projectId: number,
    @Param('userId', ValidateIdPipe) userId: number,
    @Req() req: Request,
  ) {
    const project = await this.projectService.findProjectById(projectId);
    if (!project) {
      throw new NotFoundException(
        `Id가 ${projectId}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException(
        `Id가 ${userId}에 해당하는 사용자가 존재하지 않습니다.`,
      );
    }

    const requestUserId = req.user.Id; //세션장이 세션참여자를 초대
    if (requestUserId !== project.userId) {
      throw new UnauthorizedException(`유효한 접근이 아닙니다. `);
    }

    const userProject = await this.userProjectService.createUserProject(
      userId,
      projectId,
    );

    if (!userProject) {
      throw new NotFoundException(`유저 프로젝트가 생성되지 않았습니다.`);
    }

    return { result: true };
  }

  //출석 수 강제 변경 - 권장하지 않습니다.
  @Put(':projectId/user/:userId')
  @UseGuards(OnlyMemberGuard)
  async updateUserProjectById(
    @Param('projectId', ValidateIdPipe) projectId: number,
    @Param('userId', ValidateIdPipe) userId: number,
    @Body() updateUserProjectRequestDTO: UpdateUserProjectRequestDTO,
    @Req() req: Request,
  ): Promise<UserProjectResponseDTO> {
    const requestUserId = req.user.Id;

    const project = await this.projectService.findProjectById(projectId);

    if (!project) {
      throw new NotFoundException(
        `${projectId}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }

    if (requestUserId !== project.userId) {
      throw new UnauthorizedException('접근 권한이 제한됩니다.');
    }

    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException(
        `${userId}에 해당하는 사용자가 존재하지 않습니다.`,
      );
    }

    const userProject = await this.userProjectService.findUserProjectById(
      projectId,
      userId,
    );

    if (!userProject) {
      throw new NotFoundException(
        `${projectId}번 프로젝트에 ${userId}번 유저가 참여하지 않습니다.`,
      );
    }

    const updatedUserProject = await this.userProjectService.updateUserProject(
      userProject,
      updateUserProjectRequestDTO,
    );

    return new UserProjectResponseDTO(updatedUserProject);
  }

  @Delete(':projectId/user/:userId')
  @UseGuards(OnlyMemberGuard)
  async deleteUserProjectById(
    @Param('projectId', ValidateIdPipe) projectId: number,
    @Param('userId', ValidateIdPipe) userId: number,
    @Req() req: Request,
  ) {
    const project = await this.projectService.findProjectById(projectId);
    if (!project) {
      throw new NotFoundException(
        `${projectId}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException(
        `${userId}에 해당하는 사용자가 존재하지 않습니다.`,
      );
    }

    const requestUserId = req.user.Id;
    if (userId !== requestUserId) {
      throw new UnauthorizedException(`유효한 접근이 아닙니다.`);
    }

    const userProject = await this.userProjectService.findUserProjectById(
      projectId,
      userId,
    );

    if (!userProject) {
      throw new NotFoundException(
        `${projectId}번 프로젝트에 ${userId}번 유저가 참여하지 않습니다.`,
      );
    }

    try {
      await this.userProjectService.deleteUserProject(userProject.Id);
    } catch (e) {
      return { result: false };
    }

    return { result: true };
  }
}
