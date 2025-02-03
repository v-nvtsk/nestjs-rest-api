import { Body, Controller, Post, Res } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { Response } from 'express';
import { addTokenToCookies } from 'src/utils/cookies';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth/refresh')
export class RefreshController {
  constructor(private readonly refreshService: RefreshService) {}

  @Post()
  @ApiOperation({ summary: 'refresh auth' })
  @ApiBody({
    schema: { example: { accessToken: '' } },
  })
  async refresh(@Body() body: { accessToken: string }, @Res() res: Response) {
    const { accessToken } = body;
    const { status, payload } =
      await this.refreshService.refreshToken(accessToken);

    if (status === 200) {
      addTokenToCookies(res, payload.accessToken, payload.expiresAt);
    }
    return res.status(status).json(payload);
  }
}
