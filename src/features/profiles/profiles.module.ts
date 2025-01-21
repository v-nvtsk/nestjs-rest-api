import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solutions, Tasks, Users } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Tasks, Solutions])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
