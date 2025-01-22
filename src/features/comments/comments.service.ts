import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from '../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}

  async getByTaskId(task_id: number): Promise<
    {
      id: number;
      task_id: number;
      user_id: number;
      username: string;
      content: string;
      created_at: string;
    }[]
  > {
    return await this.commentsRepository
      .createQueryBuilder('c')
      .select([
        'c.id',
        'c.task_id as task_id',
        'u.id as user_id',
        'u.username as username',
        'c.content as content',
        'c.created_at as created_at',
      ])
      .leftJoin('users', 'u', 'u.id = c.user_id')
      .where('c.task_id = :task_id', { task_id })
      .orderBy('c.created_at', 'ASC')
      .getRawMany();
  }

  async create({ content, task_id, user_id, created_at = new Date() }) {
    const result = await this.commentsRepository.create({
      content,
      task_id,
      user_id,
      created_at,
    });

    await this.commentsRepository.save(result);
    return result;
  }

  async update(id: number, { content, user_id }) {
    const result = await this.commentsRepository
      .createQueryBuilder()
      .update()
      .set({
        content,
        created_at: new Date(),
      })
      .where('id = :id', { id })
      .andWhere('user_id = :user_id', { user_id })
      .execute();

    if (result.affected === 0) {
      throw new Error('Comment not found or user_id mismatch');
    }

    return result;
  }

  async delete(id: number) {
    const result = await this.commentsRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('Comment not found');
    }

    return result;
  }
}
