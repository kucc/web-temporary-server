import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventEntity } from '../../event/event.entity';

@Entity({
  name: 'EventTypes',
})
export class EventTypeEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  public Id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public name: string;

  @OneToMany(
    type => EventEntity,
    event => event.eventTypeId,
  )
  public events: EventEntity[];
}
