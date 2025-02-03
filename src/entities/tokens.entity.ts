import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('user_tokens')
export class UserTokens {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;
}
