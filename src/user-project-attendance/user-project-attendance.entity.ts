import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from '../common/entity/base.entity';
import { UserProjectEntity } from '../user-project/user-project.entity';
import { AttendanceTypeEntity } from '../common/entity/attendance-type.entity';
import { AttendanceResponseDTO } from './dto/attendance-response.dto';

@Entity({
  name: 'Attendances',
})
export class AttendanceEntity extends Base {
  @Column({
    name: 'description',
    type: 'text',
  })
  public description: string;

  // @Column({
  //   name: 'publishedAt',
  //   type: 'date',
  // })
  // public publishedAt: string;

  @Column({
    name: 'userProjectId',
    type: 'int',
    nullable: false,
  })
  public userProjectId: number;

  @ManyToOne(
    type => UserProjectEntity,
    userProject => userProject.attendances,
  )
  @JoinColumn({
    name: 'userProjectId',
    referencedColumnName: 'Id',
  })
  public userProject: UserProjectEntity;

  @Column({
    name: 'attendanceTypeId',
    type: 'int',
    nullable: false,
  })
  public attendanceTypeId: number;

  @ManyToOne(
    type => AttendanceTypeEntity,
    attendanceType => attendanceType.Id,
  )
  @JoinColumn({
    name: 'attendanceTypeId',
    referencedColumnName: 'Id',
  })
  public attendanceType: AttendanceTypeEntity;
}
