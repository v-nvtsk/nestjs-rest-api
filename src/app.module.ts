import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments, Roles, Tasks, Users, UserTokens } from './entities';
import { AuthModule } from './features/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { TasksModule } from './features/tasks/tasks.module';
import { CommentsModule } from './features/comments/comments.module';
import { Solutions } from './entities/solutions.entity';
import { ProfilesModule } from './features/profiles/profiles.module';
import { DatabaseInitService } from './services/db-init/db-init';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [Users, UserTokens, Roles, Comments, Tasks, Solutions],
      subscribers: [],
      migrations: [process.env.TYPEORM_MIGRATIONS || 'dist/migrations/*.js'],
    }),
    TypeOrmModule.forFeature([Users, Roles]),
    AuthModule,
    TasksModule,
    CommentsModule,
    ProfilesModule,
  ],
  controllers: [],

  providers: [
    DatabaseInitService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RefreshTokenInterceptor,
    },
  ],
})
export class AppModule {}
