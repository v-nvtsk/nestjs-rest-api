import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

export interface Filter {
  role: string;
}

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string | number) {
    return await this.profilesService.getProfile(+id);
  }

  @Post('all')
  async findAll(@Body() body: { filter: Filter }) {
    return await this.profilesService.getProfiles(body.filter);
  }
}
