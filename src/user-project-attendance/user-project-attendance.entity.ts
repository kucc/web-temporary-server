import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

import { Base } from '../common/entity/base.entity';
import { UserProjectEntity } from '../user-project/user-project.entity';
import { ATTENDANCE_TYPE } from '../constants';

@Entity({
  name: 'Attendances',
})
@Unique(['userProjectId', 'publishedAt'])
export class AttendanceEntity extends Base {
  @Column({
    name: 'description',
    type: 'text',
  })
  public description: string;

  @Column({
    name: 'publishedAt',
    type: 'date',
    nullable: false,
  })
  public publishedAt: string;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public type: ATTENDANCE_TYPE;

  @Column({
    name: 'lateTime',
    type: 'int',
    default: 0,
  })
  public lateTime: number;

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
}
