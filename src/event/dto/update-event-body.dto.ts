import { IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateEventBodyDTO {
  @IsNotEmpty()
  public readonly name: string;

  public readonly description: string;

  @IsNotEmpty()
  public readonly place: string;

  @IsNotEmpty()
  public readonly color: string;

  @IsDateString()
  public readonly startAt: string;

  @IsDateString()
  public readonly endAt: string;
}
