import { Max, IsNumber } from 'class-validator';

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

  @IsNumber()
  @Max(20)
  public readonly totalLate: number;
}
