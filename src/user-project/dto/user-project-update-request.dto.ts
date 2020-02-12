import { Max, IsNumber } from 'class-validator';
// import { ProjectEntity } from '../../project/project.entity';

export class UpdateUserProjectRequestDTO {
  @IsNumber()
  @Max(50)
  public readonly attend: number;

  @IsNumber()
  @Max(50)
  public readonly late: number;

  @IsNumber()
  @Max(50)
  public readonly absent: number;

  @IsNumber()
  @Max(50)
  public readonly noticedAbsent: number;
}
