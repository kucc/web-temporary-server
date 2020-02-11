import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttendanceEntity } from '../../user-project-attendance/user-project-attendance.entity';

@Entity({
  name: 'AttendanceTypes',
})
export class AttendanceTypeEntity {
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
    type => AttendanceEntity,
    attendance => attendance.attendanceTypeId,
  )
  public attendances: AttendanceEntity[];
}
