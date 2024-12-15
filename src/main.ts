import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { Logger } from './services/logger/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: Logger('rest-server'),
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3300);

  app.use(cookieParser());
  app.enableCors();
  app.setGlobalPrefix('api');

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Contest App API')
    .setDescription('API documentation with cookie-based authentication')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  await app.listen(port);
}
bootstrap();
