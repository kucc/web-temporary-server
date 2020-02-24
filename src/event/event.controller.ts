import {
  Controller,
  Post,
  Delete,
  Put,
  UseGuards,
  Param,
  Get,
  NotFoundException,
  Req,
  Body,
  UnauthorizedException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { Request } from 'express';

import { EventEntity } from './event.entity';
import { EventService } from './event.service';
import { EventResponseDTO } from './dto/event-response.dto';
import { FindEventListDTO } from './dto/find-event-list.dto';
import { ValidateIdPipe } from '../common/pipe/validate-id.pipe';
import { CreateEventBodyDTO } from './dto/create-event-body.dto';
import { UpdateEventBodyDTO } from './dto/update-event-body.dto';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';

@Controller('event')
export class EventController {
  public constructor(private readonly eventService: EventService) {}

  @Get(':Id')
  @UseGuards(OnlyMemberGuard)
  async getEventById(
    @Param('Id', ValidateIdPipe) Id: number,
  ): Promise<EventEntity> {
    const event = await this.eventService.findEventById(Id);

    if (!event) {
      throw new NotFoundException(
        `${Id}번에 해당하는 이벤트가 존재하지 않습니다.`,
      );
    }

    return event;
  }

  @Get('')
  @UseGuards(OnlyMemberGuard)
  async findEventsByDate(
    @Query('year', ValidateIdPipe) year: number,
    @Query('month', ValidateIdPipe) month: number,
  ): Promise<FindEventListDTO> {
    const events = await this.eventService.findEventsByDate(year, month);

    if (!events.length) {
      throw new NotFoundException(`해당 기간에 존재하는 이벤트가 없습니다.`);
    }

    return new FindEventListDTO(events);
  }

  @Post('')
  @UseGuards(OnlyMemberGuard)
  async createEvent(
    @Req() req: Request,
    @Body() createEventBodyDTO: CreateEventBodyDTO,
  ): Promise<EventResponseDTO> {
    const requestUserId = req.user.Id;

    const event = await this.eventService.createEvent(
      createEventBodyDTO,
      requestUserId,
    );

    if (!event) {
      throw new NotFoundException(`이벤트가 생성에 실패했습니다.`);
    }

    const startAt = new Date(event.startAt);
    const endAt = new Date(event.endAt);
    if (startAt > endAt) {
      throw new BadRequestException(`시간을 다시 설정해주세요`);
    }

    return new EventResponseDTO(event);
  }

  @Put(':Id')
  @UseGuards(OnlyMemberGuard)
  async updateEvent(
    @Param('Id', ValidateIdPipe) Id: number,
    @Body() updateEventBodyDTO: UpdateEventBodyDTO,
    @Req() req: Request,
  ): Promise<EventResponseDTO> {
    const event = await this.eventService.findEventById(Id);
    if (!event) {
      throw new NotFoundException(
        `${Id}번에 해당하는 이벤트가 존재하지 않습니다.`,
      );
    }

    if (event.userId !== req.user.Id) {
      throw new UnauthorizedException(`유효한 접근이 아닙니다.`);
    }
    const newEvent = await this.eventService.updateEvent(
      event,
      updateEventBodyDTO,
    );

    if (!newEvent) {
      throw new NotFoundException(`이벤트를 업데이트하는데 실패했습니다.`);
    }

    const startAt = new Date(newEvent.startAt);
    const endAt = new Date(newEvent.endAt);
    if (startAt > endAt) {
      throw new BadRequestException(`시간을 다시 설정해주세요`);
    }

    return new EventResponseDTO(newEvent);
  }

  @Delete(':Id')
  @UseGuards(OnlyMemberGuard)
  async deleteEvent(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() req: Request,
  ) {
    const event = await this.eventService.findEventById(Id);
    if (!event) {
      throw new NotFoundException(
        `${Id}번에 해당하는 이벤트가 존재하지 않습니다.`,
      );
    }

    if (event.userId !== req.user.Id) {
      throw new NotFoundException(`유효하지 않은 접근입니다.`);
    }

    try {
      await this.eventService.deleteEvent(Id);
    } catch (e) {
      return { result: false };
    }

    return { result: true };
  }
}
