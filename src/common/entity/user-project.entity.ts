import { Entity, ManyToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { ProjectEntity } from '../../project/project.entity';
import { Base } from './base.entity';
import { UserProjectAttendanceEntity } from './user-project-attendance.entity';

@Entity({
  name: 'UserProjects',
})
export class UserProjectEntity extends Base {
  @ManyToOne(
    type => UserEntity,
    user => user.userProjects,
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public userId: Number;

  @ManyToOne(
    type => ProjectEntity,
    project => project.userProjects,
  )
  @JoinColumn({
    name: 'projectId',
    referencedColumnName: 'Id',
  })
  public projectId: Number;

  @Column({
    name: 'attendance',
    type: 'int',
    default: 0,
  })
  public attendance: Number;

  @Column({
    name: 'late',
    type: 'int',
    default: 0,
  })
  public late: Number;

  @Column({
    name: 'absense',
    type: 'int',
    default: 0,
  })
  public absense: Number;

  @OneToMany(
    type => UserProjectAttendanceEntity,
    userProjectAttendanceEntity => userProjectAttendanceEntity.userProjectId,
  )
  public attendances: UserProjectAttendanceEntity[];
}
