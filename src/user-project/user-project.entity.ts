import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
  Unique,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { Base } from '../common/entity/base.entity';
import { ProjectEntity } from '../project/project.entity';
import { AttendanceEntity } from '../user-project-attendance/user-project-attendance.entity';

@Entity({
  name: 'UserProjects',
})
@Unique(['userId', 'projectId'])
export class UserProjectEntity extends Base {
  @Column({
    name: 'userId',
    type: 'int',
    nullable: false,
  })
  public userId: number;

  @ManyToOne(
    type => UserEntity,
    user => user.userProjects,
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public user: UserEntity;

  @Column({
    name: 'projectId',
    type: 'int',
    nullable: false,
  })
  public projectId: number;

  @ManyToOne(
    type => ProjectEntity,
    project => project.userProjects,
  )
  @JoinColumn({
    name: 'projectId',
    referencedColumnName: 'Id',
  })
  public project: ProjectEntity;

  @Column({
    name: 'attend',
    type: 'int',
    default: 0,
  })
  public attend: number;

  @Column({
    name: 'late',
    type: 'int',
    default: 0,
  })
  public late: number;

  @Column({
    name: 'absent',
    type: 'int',
    default: 0,
  })
  public absent: number;

  @Column({
    name: 'noticedAbsent',
    type: 'int',
    default: 0,
  })
  public noticedAbsent: number;

  @Column({
    name: 'totalLate',
    type: 'int',
    default: 0,
  })
  public totalLate: number;

  @OneToMany(
    type => AttendanceEntity,
    AttendanceEntity => AttendanceEntity.userProject,
  )
  public attendances: AttendanceEntity[];
}
