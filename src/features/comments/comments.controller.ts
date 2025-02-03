import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Req,
  Res,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { CommentsService } from './comments.service';
import { Request, Response } from 'express';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get all comments by task ID' })
  async getById(@Param('id') id: number) {
    return await this.commentsService.getByTaskId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new comment for task' })
  @ApiBody({
    schema: {
      example: {
        content: '',
        task_id: 0,
      },
    },
  })
  async create(
    @Body() body: { content: string; task_id: number },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { content, task_id } = body;
    const { userId: user_id, username } = req['user'];
    try {
      const result = await this.commentsService.create({
        content,
        task_id,
        user_id,
      });
      return res.status(201).json({ ...result, username });
    } catch (_) {
      res.status(500).json({ message: 'Server failed on comment creation' });
    }
  }

  @Put()
  @ApiOperation({ summary: 'Update existing comment' })
  @ApiBody({
    schema: {
      example: {
        id: 0,
        content: 'new comment content',
      },
    },
  })
  async update(
    @Body() body: { content: string; id: number },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { content, id } = body;
    const user_id = req['user']['id'];

    try {
      const result = await this.commentsService.update(id, {
        content,
        user_id,
      });
      res.status(200).json(result.raw);
    } catch (_) {
      res.status(500).json({ message: 'Server failed on comment update' });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete existing comment' })
  async delete(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.commentsService.delete(id);
      res.status(200).json(result.raw);
    } catch (_) {
      res.status(500).json({ message: 'Server failed on comment deletion' });
    }
  }
}
