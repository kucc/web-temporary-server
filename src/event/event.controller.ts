import {
  Controller,
  Post,
  Delete,
  Put,
  UseGuards,
  Param,
  Get,
} from '@nestjs/common';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { ValidateIdPipe } from '../common/pipe/validate-id.pipe';

@Controller('event')
export class EventController {
  @Get(':Id')
  @UseGuards(OnlyMemberGuard)
  async getEventById(@Param('Id', ValidateIdPipe) Id: number) {}

  @Post('')
  @UseGuards(OnlyMemberGuard)
  async createEvent() {}

  @Put('')
  @UseGuards(OnlyMemberGuard)
  async updateEvent() {}

  @Delete('')
  @UseGuards(OnlyMemberGuard)
  async deleteEvent() {}
}
