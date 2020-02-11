import { Max, IsNumber } from 'class-validator';
// import { ProjectEntity } from '../../project/project.entity';

export class UpdateUserProjectRequestDTO {
  @IsNumber()
  @Max(50)
  public readonly attendance: number;

  @IsNumber()
  @Max(50)
  public readonly late: number;

  @IsNumber()
  @Max(50)
  public readonly absence: number;
}
