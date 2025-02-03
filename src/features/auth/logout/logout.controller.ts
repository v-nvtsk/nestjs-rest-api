import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Auth')
@Controller('auth/logout')
@UseGuards(AuthGuard)
export class LogoutController {
  constructor() {}

  @Get()
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('accessToken');
    return res.sendStatus(200);
  }
}
