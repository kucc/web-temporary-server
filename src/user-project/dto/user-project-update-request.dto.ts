import { Max, IsNumber } from 'class-validator';

export class UpdateUserProjectRequestDTO {
  @IsNumber()
  @Max(100)
  public readonly attendace: number;

  @IsNumber()
  @Max(100)
  public readonly late: number;

  @IsNumber()
  @Max(100)
  public readonly absence: number;
}
