import { Module } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { SolutionsController } from './solutions.controller';
import { Solutions } from '@/entities/solutions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Solutions])],
  controllers: [SolutionsController],
  providers: [SolutionsService],
})
export class SolutionsModule {}
