import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from '../common/entity/base.entity';
import { EventTypeEntity } from '../common/entity/event-type.entity';
import { UserEntity } from '../user/user.entity';

@Entity({
  name: 'Events',
})
export class EventEntity extends Base {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description: string;

  @Column({
    name: 'startAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public startAt: string;

  @Column({
    name: 'endAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public endAt: string;

  @Column({
    name: 'place',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public place: boolean;

  @ManyToOne(
    type => UserEntity,
    user => user.events,
  )
  @JoinColumn({ name: 'userId', referencedColumnName: 'Id' })
  public userId: number;

  @ManyToOne(
    type => EventTypeEntity,
    eventType => eventType.events,
  )
  @JoinColumn({ name: 'eventTypeId', referencedColumnName: 'Id' })
  public eventTypeId: number;
}
