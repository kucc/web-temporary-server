import { IsNotEmpty, IsEmpty } from 'class-validator';

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

  @IsNotEmpty()
  public readonly startAt: string;

  @IsNotEmpty()
  public readonly endAt: string;
}
