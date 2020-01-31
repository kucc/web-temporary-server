import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { UserProjectEntity } from './user-project.entity';

@Entity({
  name: 'UserProjectAttendances',
})
export class UserProjectAttendanceEntity extends Base {
  @Column({
    name: 'userId',
    type: 'int',
    nullable: false,
  })
  public userId: Number;

  @Column({
    name: 'projectId',
    type: 'int',
    nullable: false,
  })
  public projectId: Number;

  @Column({
    name: 'description',
    type: 'text',
  })
  public description: String;

  @ManyToOne(
    type => UserProjectEntity,
    userProject => userProject.attendances,
    { nullable: false },
  )
  @JoinColumn({
    name: 'userProjectId',
    referencedColumnName: 'Id',
  })
  public userProjectId: Number;
}
