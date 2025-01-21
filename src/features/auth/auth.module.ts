import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { RegisterModule } from './register/register.module';
import { RefreshTokenModule } from './refresh/refresh.module';

@Module({
  imports: [LoginModule, LogoutModule, RegisterModule, RefreshTokenModule],
})
export class AuthModule {}
