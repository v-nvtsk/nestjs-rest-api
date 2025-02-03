import { Module } from '@nestjs/common';
import { LogoutController } from './logout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [LogoutController],
  providers: [],
  exports: [],
})
export class LogoutModule {}
