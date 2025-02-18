import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('tasks')
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: false, default: '' })
  examples: string;

  @Column({ type: 'varchar', length: 50 })
  difficulty;

  @Column({ type: 'varchar', length: 50, default: 'common' })
  category: string;

  @Column('text', { array: true })
  tags: string[];

  @Column('text', { array: true })
  additional_materials: string[];

  @Column({ type: 'text', default: '' })
  code: string;
}
