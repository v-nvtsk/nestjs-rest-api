import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users, UserTokens } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserTokens])],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
