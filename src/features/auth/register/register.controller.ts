import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({
    schema: { example: { username: 'johndoe', password: 'password123' } },
  })
  @Post()
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    const result = await this.registerService.create(username, password);

    return result;
  }
}
