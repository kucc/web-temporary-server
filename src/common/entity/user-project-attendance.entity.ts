import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { UserProjectEntity } from '../../user-project/user-project.entity';

@Entity({
  name: 'UserProjectAttendances',
})
export class UserProjectAttendanceEntity extends Base {
  @Column({
    name: 'userId',
    type: 'int',
    nullable: false,
  })
  public userId: number;

  @Column({
    name: 'projectId',
    type: 'int',
    nullable: false,
  })
  public projectId: number;

  @Column({
    name: 'description',
    type: 'text',
  })
  public description: string;

  @Column({
    name: 'userProjectId',
    type: 'int',
    nullable: false,
  })
  public userProjectId: number;

  @ManyToOne(
    type => UserProjectEntity,
    userProject => userProject.attendances,
    { nullable: false },
  )
  @JoinColumn({
    name: 'userProjectId',
    referencedColumnName: 'Id',
  })
  public userProject: UserProjectEntity;
}
