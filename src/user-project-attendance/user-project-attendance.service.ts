import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AttendanceEntity } from './user-project-attendance.entity';
import { AttendanceRequestDTO } from './dto/attendance-request.dto';
import { UpdateAttendanceRequestDTO } from './dto/attendance-update-request.dto';

@Injectable()
export class AttendanceService {
  public constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
  ) {}

  public async findAttendanceById(
    userProjectId: number,
    attendId: number,
  ): Promise<AttendanceEntity> {
    const attendance = await this.attendanceRepository.findOne({
      where: {
        Id: attendId,
        userProjectId,
        status: true,
      },
    });

    return attendance;
  }

  public async getAttendanceList(Id: number): Promise<AttendanceEntity[]> {
    const attendanceList = await this.attendanceRepository.find({
      where: {
        userProjectId: Id,
        status: true,
      },
      order: { createdAt: 'ASC' },
    });

    return attendanceList;
  }

  public async createAttendance(
    userProjectId: number,
    attendanceRequestDTO: AttendanceRequestDTO,
  ): Promise<AttendanceEntity> {
    attendanceRequestDTO.userProjectId = userProjectId;
    const attendance = this.attendanceRepository.create(attendanceRequestDTO);
    await this.attendanceRepository.save(attendance);
    return attendance;
  }

  public async deleteAttendanceById(Id: number) {
    await this.attendanceRepository.update(Id, { status: false });
    return { result: true };
  }

  public async updateAttendance(
    attend: AttendanceEntity,
    updateAttendanceRequestDTO: UpdateAttendanceRequestDTO,
  ): Promise<AttendanceEntity> {
    const newAttendance = this.attendanceRepository.merge(
      attend,
      updateAttendanceRequestDTO,
    );
    await this.attendanceRepository.save(newAttendance);
    return newAttendance;
  }

  public async updateTotalLate(Id: number) {}
}
