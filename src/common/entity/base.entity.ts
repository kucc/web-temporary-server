import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  public Id: number;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: string;

  @Column({
    name: 'status',
    type: 'boolean',
    default: true,
  })
  public status: boolean;
}
