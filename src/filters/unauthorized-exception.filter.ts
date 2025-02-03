import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidTokenException } from 'src/guards/auth.guard';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof InvalidTokenException) {
      response.clearCookie('accessToken');
    }

    response.status(401).json({
      statusCode: 401,
      message: exception.message || 'Unauthorized',
    });
  }
}
