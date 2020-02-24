import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';

import { EventEntity } from './event.entity';
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

  public async findEventsByDate(
    year: number,
    month: number,
  ): Promise<EventEntity[]> {
    const begin = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));

    const events = await this.eventRepository.find({
      where: [
        { status: true, endAt: Between(begin, end) },
        { status: true, startAt: LessThan(end), endAt: MoreThan(end) },
      ],
      order: { startAt: 'ASC' },
    });

    return events;
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
