import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { Users } from '../../entities';

export interface Filter {
  role: string;
}

@UseGuards(AuthGuard)
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

  @Put(':id')
  @ApiOperation({ summary: 'Update profile rating' })
  @ApiBody({
    schema: {
      example: { rating: 5 },
    },
  })
  async updateProfileRating(
    @Param('id') id: string | number,
    @Body() { rating }: { rating: number },
  ) {
    return await this.profilesService.updateProfileRating(+id, rating);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update profile' })
  @ApiBody({
    schema: {
      example: {
        username: 'newUsername',
        rating: 5,
      },
    },
  })
  async updateProfile(
    @Param('id') id: string | number,
    @Body() profile: Partial<Users>,
  ) {
    return await this.profilesService.updateProfile(+id, profile);
  }
}
