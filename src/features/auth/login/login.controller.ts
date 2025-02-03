import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { Response } from 'express';
import { addTokenToCookies } from 'src/utils/cookies';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: { example: { username: 'johndoe', password: 'password123' } },
  })
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
  ) {
    const { username, password } = body;
    const { status, payload } = await this.loginService.login(
      username,
      password,
    );

    if (status === 200) {
      addTokenToCookies(res, payload.accessToken, payload.expiresAt);
    }
    return res.status(status).json(payload);
  }
}
