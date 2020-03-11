import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { Base } from '../common/entity/base.entity';
import { UserProjectEntity } from '../user-project/user-project.entity';

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

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public avatar: string;

  @Column({
    name: 'season',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public season: string;

  @Column({
    name: 'userId',
    type: 'int',
    nullable: false,
  })
  public userId: number;

  @ManyToOne(
    type => UserEntity,
    user => user.projects,
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public user: UserEntity;

  @OneToMany(
    type => UserProjectEntity,
    userProject => userProject.project,
  )
  public userProjects: UserProjectEntity[];
}
