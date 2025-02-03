import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tasks } from './tasks.entity';
import { Users } from './users.entity';

@Entity('solutions')
export class Solutions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tasks, (task) => task.id, { nullable: false })
  @JoinColumn({ name: 'task_id' })
  task: Tasks;

  @ManyToOne(() => Users, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column('text')
  source_code: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('int', { nullable: true })
  mark: number;
}
