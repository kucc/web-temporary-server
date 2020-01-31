import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from '../common/entity/base.entity';
import { UserProjetEntity } from '../common/entity/user-project.entity';
import { UserEntity } from '../user/user.entity';

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

  @ManyToOne(
    type => UserEntity,
    user => user.projects,
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'Id',
  })
  public userId: Number;
}
