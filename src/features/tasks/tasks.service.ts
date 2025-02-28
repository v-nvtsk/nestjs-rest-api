import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks, Users } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllCategories() {
    const categories = await await this.tasksRepository
      .createQueryBuilder('tasks')
      .select(['category'])
      .distinct(true)
      .getRawMany();

    return categories.map(({ category }) => category);
  }

  async getAll({ offset = 0, limit = 10, category, difficulty, tags = [] }) {
    const query = this.tasksRepository.createQueryBuilder('tasks').select();

    if (category) {
      query.andWhere('tasks.category = :category', { category });
    }

    if (difficulty) {
      query.andWhere('tasks.difficulty = :difficulty', { difficulty });
    }

    if (tags.length) {
      query.andWhere('tasks.tags && :tags', { tags });
    }

    const queryResult = await query
      .take(limit)
      .skip(offset)
      .orderBy('id')
      .getMany();

    return queryResult;
  }

  async getById(id: number) {
    return await this.tasksRepository.findOneBy({ id });
  }

  async create({
    title,
    description,
    examples,
    difficulty,
    tags,
    additional_materials,
    category,
    user_id,
  }: {
    title: string;
    description: string;
    examples: string;
    difficulty: string;
    tags: string[];
    additional_materials: string[];
    category: string;
    user_id: number;
  }): Promise<Tasks> {
    const user = await this.usersRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new Error('User not found');
    }

    const task = this.tasksRepository.create({
      title,
      description,
      examples,
      difficulty,
      tags,
      additional_materials,
      category,
      user,
    });

    return await this.tasksRepository.save(task);
  }

  async update(
    id: number,
    {
      title,
      description,
      examples,
      difficulty,
      tags,
      additional_materials,
      category,
      code,
    },
  ) {
    return await this.tasksRepository.update(id, {
      title,
      description,
      examples,
      difficulty,
      tags,
      additional_materials,
      category,
      code,
    });
  }

  async delete(id: number) {
    return await this.tasksRepository.delete(id);
  }
}
