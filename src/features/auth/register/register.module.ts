import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles, Users } from 'src/entities';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles])],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
