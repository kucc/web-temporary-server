import { EventEntity } from '../event.entity';
import { EventResponseDTO } from './event-response.dto';

export class FindEventListDTO {
  public constructor(events: EventEntity[]) {
    this.count = events.length;
    this.data = events.map(event => {
      return new EventResponseDTO(event);
    });
  }
  public readonly count: number;
  public readonly data: object;
}
