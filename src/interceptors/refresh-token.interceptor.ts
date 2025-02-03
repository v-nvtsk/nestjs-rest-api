import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { generateAccessToken } from 'src/utils/jwt';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const user = request['user'];
    if (user) {
      const newToken = generateAccessToken({ userId: user.id });
      const expiresAt = new Date(
        Date.now() + Number(process.env.JWT_ACCESS_EXPIRES_IN) * 1000,
      );

      response.cookie('accessToken', newToken, {
        httpOnly: true,
        expires: expiresAt,
      });
    }

    return next.handle();
  }
}
