import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Tasks, Users } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks, Users])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
