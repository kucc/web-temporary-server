import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PostEntity } from '../../post/post.entity';

@Entity({
  name: 'PostTypes',
})
export class PostTypeEntity {
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
    type => PostEntity,
    post => post.postTypeId,
  )
  public posts: PostEntity[];
}
