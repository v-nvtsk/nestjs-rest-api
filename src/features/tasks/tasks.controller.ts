import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { TasksService } from './tasks.service';
import { ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get task categories' })
  async getAllCategories() {
    return await this.tasksService.getAllCategories();
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
    example: 0,
    description: 'Offset for pagination',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Limit for pagination',
  })
  @ApiQuery({
    name: 'category',
    type: String,
    required: false,
    example: '',
    description: 'Category filter',
  })
  @ApiQuery({
    name: 'difficulty',
    type: String,
    required: false,
    example: '',
    description: 'Difficulty filter',
  })
  @ApiQuery({
    name: 'tags',
    type: [String],
    required: false,
    example: ['tag1', 'tag2'],
    description: 'Tags filter',
  })
  async getAllTasks(@Query() params: any) {
    const { offset, limit, category, difficulty, tags: tagsParam } = params;

    const tags =
      tagsParam && typeof tagsParam === 'string' ? [tagsParam] : tagsParam;

    return await this.tasksService.getAll({
      offset,
      limit,
      category,
      difficulty,
      tags,
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async getTaskById(@Param('id') id: number) {
    const result = await this.tasksService.getById(id);
    return result;
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create new task' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        examples: { type: 'string' },
        difficulty: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        additional_materials: { type: 'array', items: { type: 'string' } },
        category: { type: 'string' },
      },
      example: {
        title: '',
        description: '',
        examples: '',
        difficulty: '',
        tags: [''],
        additional_materials: [''],
        category: 'common',
      },
    },
  })
  async createTask(@Req() req: Request, @Res() res: Response) {
    const {
      title,
      description,
      examples,
      difficulty,
      tags,
      additional_materials,
      category,
    } = req.body;

    try {
      const result = await this.tasksService.create({
        title,
        description,
        examples,
        difficulty,
        tags,
        additional_materials,
        category,
      });
      return res.status(201).json(result);
    } catch (_) {
      res.status(500).json({ message: 'Server failed while task creation' });
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update existing task' })
  @ApiBody({
    schema: {
      example: {
        title: '',
        description: '',
        examples: '',
        difficulty: '',
        tags: [''],
        additional_materials: [''],
        category: 'common',
      },
    },
  })
  async updateTask(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const {
      title,
      description,
      examples,
      difficulty,
      tags,
      additional_materials,
      category,
      code,
    } = req.body;

    try {
      const result = await this.tasksService.update(id, {
        title,
        description,
        examples,
        difficulty,
        tags,
        additional_materials,
        category,
        code,
      });
      res.status(200).json(result.raw);
    } catch (_) {
      // logger.error('Error updating task:', error);
      res.status(500).json({ message: '' });
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiBody({
    schema: {
      example: {
        id: 0,
      },
    },
  })
  async deleteTask(@Param('id') id: number, @Res() res: Response) {
    try {
      const result = await this.tasksService.delete(id);
      res.status(200).json(result.raw);
    } catch (_) {
      res.status(500).json({ message: 'Server failed on task deletion' });
    }
  }
}
