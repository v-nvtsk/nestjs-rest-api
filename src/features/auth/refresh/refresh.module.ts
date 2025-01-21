import { Module } from '@nestjs/common';
import { RefreshController } from './refresh.controller';
import { RefreshService } from './refresh.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users, UserTokens } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserTokens])],
  controllers: [RefreshController],
  providers: [RefreshService],
})
export class RefreshTokenModule {}
