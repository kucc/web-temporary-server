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
import { Http2ServerRequest } from 'http2';

@Controller('project')
export class ProjectController {
  public constructor(private readonly projectService: ProjectService) {}

  @Get(':Id')
  async getProjectById(
    @Param('Id', ValidateIdPipe) Id: Number,
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
    @Param('Id', ValidateIdPipe) Id: Number,
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
  async deleteProjectById(@Param('Id', ValidateIdPipe) Id: Number) {
    const Project = await this.projectService.findProjectById(Id);
    if (!Project) {
      throw new NotFoundException(
        `${Id}에 해당하는 프로젝트가 존재하지 않습니다.`,
      );
    } else {
      this.projectService.deleteProjectById(Id);
    }
  }
}
