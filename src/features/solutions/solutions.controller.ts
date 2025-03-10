import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { AuthGuard } from '@/guards/auth.guard';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('solutions')
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Добавление решения задачи' })
  @ApiBody({
    schema: {
      example: {
        task_id: 1,
        user_id: 1,
        source_code: "console.log('Hello World!')",
      },
    },
  })
  create(
    @Body() body: { task_id: number; user_id: number; source_code: string },
  ) {
    return this.solutionsService.create(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Get solution of user user_id for task with task_id',
  })
  @ApiQuery({
    name: 'task_id',
    type: Number,
    required: true,
    example: 0,
    description: 'task_id',
  })
  @ApiQuery({
    name: 'user_id',
    type: Number,
    required: true,
    example: 10,
    description: 'user_id',
  })
  async findForTaskAndUser(
    @Query() query: { task_id: number; user_id: number },
  ) {
    const { task_id, user_id } = query;
    return await this.solutionsService.findSolution(task_id, user_id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { mark: number }) {
    const { mark } = body;

    return this.solutionsService.update(Number(id), mark);
  }
}
