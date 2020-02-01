import { Entity, ManyToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from '../project/project.entity';
import { Base } from '../common/entity/base.entity';
import { UserProjectAttendanceEntity } from '../common/entity/user-project-attendance.entity';

@Entity({
  name: 'UserProjects',
})
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
    name: 'attendance',
    type: 'int',
    default: 0,
  })
  public attendance: number;

  @Column({
    name: 'late',
    type: 'int',
    default: 0,
  })
  public late: number;

  @Column({
    name: 'absense',
    type: 'int',
    default: 0,
  })
  public absense: number;

  @OneToMany(
    type => UserProjectAttendanceEntity,
    userProjectAttendanceEntity => userProjectAttendanceEntity.userProjectId,
  )
  public attendances: UserProjectAttendanceEntity[];
}