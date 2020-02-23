import { EventEntity } from '../event.entity';

export class EventResponseDTO {
  public constructor(event: EventEntity) {
    this.Id = event.Id;
    this.name = event.name;
    this.userId = event.userId;
    this.description = event.description;
    this.createdAt = event.createdAt;
    this.endAt = event.endAt;
    this.color = event.color;
    this.place = event.place;
  }
  public readonly Id: number;
  public readonly name: string;
  public readonly userId: number;
  public readonly description: string;
  public readonly createdAt: string;
  public readonly endAt: string;
  public readonly color: string;
  public readonly place: string;
}
