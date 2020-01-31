import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { Base } from '../common/entity/base.entity';
import { UserProjectEntity } from '../common/entity/user-project.entity';

@Entity({
  name: 'Projects',
})
export class ProjectEntity extends Base {
  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public title: string;

  @Column({
    name: 'place',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public place: string;

  @Column({
    name: 'maxAttendance',
    type: 'int',
    nullable: true,
    default: 10,
  })
  public maxAttendance: number;

  @OneToMany(
    type => UserProjectEntity,
    userProject => userProject.projectId,
  )
  public userProjects: UserProjectEntity[];

  @ManyToOne(
    type => UserEntity,
    user => user.projects,
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public userId: number;
}
