import { IsNotEmpty } from 'class-validator';

export class UpdateEventBodyDTO {
  @IsNotEmpty()
  public readonly name: string;

  public readonly description: string;

  @IsNotEmpty()
  public readonly place: string;

  @IsNotEmpty()
  public readonly color: string;

  @IsNotEmpty()
  public readonly startAt: string;

  @IsNotEmpty()
  public readonly endAt: string;
}
