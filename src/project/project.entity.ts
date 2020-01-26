import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from '../common/entity/base.entity';
import { UserProjetEntity } from '../common/entity/user-project.entity';

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
  public maxAttendance: Number;

  @OneToMany(
    type => UserProjetEntity,
    userProject => userProject.projectId,
  )
  public users: UserProjetEntity[];
}
