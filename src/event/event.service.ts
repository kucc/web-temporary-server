import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { CreateEventBodyDTO } from './dto/create-event-body.dto';
import { UpdateEventBodyDTO } from './dto/update-event-body.dto';

@Injectable()
export class EventService {
  public constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  public async findEventById(Id: number): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({
      where: {
        Id,
        status: true,
      },
    });

    return event;
  }

  public async createEvent(
    createEventBodyDTO: CreateEventBodyDTO,
    userId: number,
  ) {
    createEventBodyDTO.userId = userId;
    const event = this.eventRepository.create(createEventBodyDTO);

    await this.eventRepository.save(event);

    return event;
  }

  public async updateEvent(
    event: EventEntity,
    updateEventBodyDTO: UpdateEventBodyDTO,
  ): Promise<EventEntity> {
    const newEvent = this.eventRepository.merge(event, updateEventBodyDTO);
    await this.eventRepository.save(newEvent);

    return newEvent;
  }

  public async deleteEvent(Id: number) {
    await this.eventRepository.update(Id, { status: false });

    return { result: true };
  }
}
