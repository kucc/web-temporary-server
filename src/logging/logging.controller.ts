import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { OnlyMemberGuard } from '../common/guards/only-member.guard';
import { Request } from 'express';
import { OnlyGuestGuard } from '../common/guards/only-guest.guard';
import { ValidateIdPipe } from '../common/pipe/validate-id.pipe';

@Controller('logging')
export class LoggingController {
  public constructor(private readonly loggingService: LoggingService) {}

  @Get('')
  @UseGuards(OnlyMemberGuard)
  async getLoggings(@Req() req: Request) {
    const reqUserId = req.user.Id;
  }

  @Get('/:Id')
  @UseGuards(OnlyMemberGuard)
  async getLoggingByUser(
    @Param('Id', ValidateIdPipe) Id: number,
    @Req() req: Request,
  ) {
    const requestUserId = req.user.Id;
  }
}
