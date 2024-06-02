import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogPost } from './post.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => BlogPost, (post) => post.tags)
  posts: BlogPost[];
}