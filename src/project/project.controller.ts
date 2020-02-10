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
} from '@nestjs/common';
import { Request } from 'express';

import { ProjectService } from './project.service';
import { ProjectRequestDTO } from './dto/project-request.dto';
import { ProjectResponseDTO } from './dto/project-response.dto';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { UpdateProjectRequestDTO } from './dto/project-update-request.dto';

@Controller('project')
export class ProjectController {
  public constructor(private readonly projectService: ProjectService) {}

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
      this.projectService.deleteProject(project);
    } catch (e) {
      return { result: false };
    }

    return { result: true };
  }

  // @Get(':projectId/user/:userId')
  // @UseGuards(OnlyMemberGuard)
  // async getUserProject(
  //   @Param('projectId', ValidateIdPipe) projectId: number,
  //   @Param('userId', ValidateIdPipe) userId: number,
  // ): Promise<UserProjectEntity>{

  //   const
  // }
}
