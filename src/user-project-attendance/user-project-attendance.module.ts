import { Module } from '@nestjs/common';
import { AttendanceService } from './user-project-attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from './user-project-attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceEntity])],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
