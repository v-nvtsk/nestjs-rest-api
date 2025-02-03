import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload } from '../types';
import { verifyAccessToken } from '../utils/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.cookies?.accessToken;

    if (!accessToken) {
      throw new InvalidTokenException('Token is missing');
    }

    try {
      const user = verifyAccessToken<AccessTokenPayload>(accessToken);
      request['user'] = user;
      return true;
    } catch (_) {
      throw new InvalidTokenException('Invalid or expired token');
    }
  }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
