import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { ProjectService } from './project.service';
import { ProjectResponseDTO } from './dto/project-response.dto';
import { ProjectRequestDTO } from './dto/project-request.dto';

@Controller('project')
export class ProjectController {
  public constructor(private readonly projectService: ProjectService) {}

  @Get(':Id')
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
  async postProject(
    @Body() projectRequestDTO: ProjectRequestDTO,
  ): Promise<ProjectResponseDTO> {
    const Project = await this.projectService.createNewProject(
      projectRequestDTO,
    );
    return new ProjectResponseDTO(Project);
  }

  @Put(':Id')
  async putProjectInfo(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() projectRequestDTO: ProjectRequestDTO,
  ): Promise<ProjectResponseDTO> {
    const Project = await this.projectService.changeProjectInfo(
      Id,
      projectRequestDTO,
    );
    return new ProjectResponseDTO(Project);
  }

  @Delete(':Id')
  @HttpCode(204)
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
