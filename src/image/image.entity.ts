import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from '../common/entity/base.entity';
import { PostEntity } from '../post/post.entity';

@Entity({
  name: 'Images',
})
export class ImageEntity extends Base {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public name: string;

  @Column({
    name: 'url',
    type: 'string',
    length: 500,
    nullable: false,
  })
  public url: string;

  @Column({
    name: 'IsRepresentative',
    type: 'boolean',
    default: true,
  })
  public IsRepresentative: boolean;

  @Column({
    name: 'postId',
    type: 'int',
    nullable: false,
  })
  public postId: number;

  @ManyToOne(
    type => PostEntity,
    post => post.images,
  )
  @JoinColumn({
    name: 'postId',
    referencedColumnName: 'Id',
  })
  public post: PostEntity;
}
