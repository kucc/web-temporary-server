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
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';

import { ProjectService } from './project.service';
import { ProjectRequestDTO } from './dto/project-request.dto';
import { ProjectResponseDTO } from './dto/project-response.dto';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { ProjectUpdateRequestDTO } from './dto/project-update-request.dto';

@Controller('project')
export class ProjectController {
  public constructor(private readonly projectService: ProjectService) {}

  @Get(':Id')
  @UseGuards(OnlyMemberGuard)
  async getProjectById(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<ProjectResponseDTO> {
    const Project = await this.projectService.findProjectById(Id);
    if (!Project) {
      throw new NotFoundException(
        `${Id}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }
    return new ProjectResponseDTO(Project);
  }

  @Post('')
  @UseGuards(OnlyMemberGuard)
  async postProject(
    @Body() projectRequestDTO: ProjectRequestDTO,
    @Req() req: Request,
  ): Promise<ProjectResponseDTO> {
    const userId = req.user.Id;

    const Project = await this.projectService.createNewProject(
      projectRequestDTO,
      userId,
    );

    return new ProjectResponseDTO(Project);
  }

  @Put(':Id')
  @UseGuards(OnlyMemberGuard)
  async putProjectInfo(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() projectUpdateRequestDTO: ProjectUpdateRequestDTO,
    @Req() req: Request,
  ): Promise<ProjectResponseDTO> {
    const userId = req.user.Id;

    let Project = await this.projectService.findProjectById(Id);

    if (Project.userId !== userId) {
      throw new NotFoundException('유효하지 않은 접근입니다.');
    }

    Project = await this.projectService.updateProject(
      Id,
      projectUpdateRequestDTO,
    );

    return new ProjectResponseDTO(Project);
  }

  @Delete(':Id')
  @UseGuards(OnlyMemberGuard)
  async deleteProjectById(@Param('Id', ValidateIdPipe) Id: number) {
    const Project = await this.projectService.findProjectById(Id);
    if (!Project) {
      throw new NotFoundException(
        `Id가 ${Id}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    }

    this.projectService.deleteProjectById(Id);

    return '삭제되었습니다.';
  }
}
