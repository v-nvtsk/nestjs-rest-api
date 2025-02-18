import { Injectable } from '@nestjs/common';
import { checkPassword } from 'src/utils/password';
import { generateAccessToken } from 'src/utils/jwt';
import { Users, UserTokens } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from 'src/types';

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

export type LoginResult = Promise<ResultOk | ResultFailed>;

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(UserTokens)
    private userTokensRepository: Repository<UserTokens>,
  ) {}

  async login(username: string, password: string): LoginResult {
    try {
      const result = await this.usersRepository.findOne({
        where: { username },
        relations: ['role'],
      });
      if (!result) {
        return {
          status: 401,
          payload: { message: 'Invalid login or password' },
        };
      }
      const hashedPassword = result.password;
      const userId = result.id;
      if (!hashedPassword) {
        return {
          status: 401,
          payload: { message: 'Invalid login or password' },
        };
      }
      const isPasswordCorrect = await checkPassword(password, hashedPassword);
      if (!isPasswordCorrect) {
        return {
          status: 401,
          payload: { message: 'Invalid login or password' },
        };
      }
      const user: AccessTokenPayload = { username, userId };
      const expiresAt = new Date(
        Date.now() + Number(process.env.JWT_ACCESS_EXPIRES_IN) * 1000,
      );
      const accessToken = generateAccessToken(
        user,
        Number(process.env.JWT_ACCESS_EXPIRES_IN),
      );
      const oldToken = await this.userTokensRepository.findOne({
        where: { user: { id: userId } },
      });
      if (oldToken) {
        await this.userTokensRepository.delete({ user: { id: userId } });
      }

      const role = result.role.name;

      await this.userTokensRepository.save({
        user: result,
        token: accessToken,
        expires_at: expiresAt,
      });

      return {
        status: 200,
        payload: { accessToken, expiresAt, id: userId, username, role },
      };
    } catch (error) {
      console.error('error: ', error);
      return {
        status: 500,
        payload: { message: `Error logging in user: ${error.message}` },
      };
    }
  }
}
