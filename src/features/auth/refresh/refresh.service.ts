import { Injectable } from '@nestjs/common';
import { generateAccessToken, verifyAccessToken } from 'src/utils/jwt';
import { Users, UserTokens } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from 'src/types';

export type LoginResult = Promise<ResultOk | ResultFailed>;

export interface ResultOk {
  status: 200;
  payload: {
    accessToken: string;
    expiresAt: Date;
    id: number;
    username: string;
    role: string;
  };
}

export interface ResultFailed {
  status: 500 | 401;
  payload: { message: string };
}

@Injectable()
export class RefreshService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(UserTokens)
    private userTokensRepository: Repository<UserTokens>,
  ) {}

  async refreshToken(accessToken: string): LoginResult {
    try {
      const tokenInDB = await this.userTokensRepository.findOne({
        where: { token: accessToken },
        relations: ['user'],
      });
      if (!tokenInDB || !verifyAccessToken(accessToken)) {
        return {
          status: 401,
          payload: { message: 'Invalid token' },
        };
      }

      const userFromToken = tokenInDB.user;

      const user: AccessTokenPayload = {
        username: userFromToken.username,
        userId: userFromToken.id,
      };
      const expiresAt = new Date(
        Date.now() + Number(process.env.JWT_ACCESS_EXPIRES_IN) * 1000,
      );
      const newAccessToken = generateAccessToken(
        user,
        Number(process.env.JWT_ACCESS_EXPIRES_IN),
      );

      await this.userTokensRepository.delete({ token: accessToken });

      await this.userTokensRepository.save({
        user: userFromToken,
        token: newAccessToken,
        expires_at: expiresAt,
      });

      const profile = await this.usersRepository.findOne({
        where: { id: userFromToken.id },
        relations: ['role'],
      });

      return {
        status: 200,
        payload: {
          accessToken: newAccessToken,
          expiresAt,
          id: userFromToken.id,
          username: userFromToken.username,
          role: profile.role.name,
        },
      };
    } catch (error) {
      return {
        status: 500,
        payload: { message: `Error refreshing token: ${error.message}` },
      };
    }
  }
}
