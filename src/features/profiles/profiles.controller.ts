import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

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

  @Get()
  @ApiOperation({ summary: 'Get all profiles with filter' })
  @ApiQuery({
    name: 'role',
    type: String,
    required: false,
    example: 'user',
    description: 'role of profile',
  })
  async findAll(@Query() params: Filter) {
    return await this.profilesService.getProfiles(params);
  }
}
