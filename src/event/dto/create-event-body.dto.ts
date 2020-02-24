import { IsNotEmpty, IsEmpty, IsDateString } from 'class-validator';

export class CreateEventBodyDTO {
  @IsNotEmpty()
  public readonly name: string;

  public readonly description: string;

  @IsEmpty()
  public userId: number;

  @IsNotEmpty()
  public readonly color: string;

  @IsNotEmpty()
  public readonly place: string;

  @IsDateString()
  public readonly startAt: string;

  @IsDateString()
  public readonly endAt: string;
}
