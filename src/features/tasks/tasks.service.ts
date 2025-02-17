import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
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
    const query = this.tasksRepository
      .createQueryBuilder('tasks')
      .select(['*']);

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
  }) {
    const task = await this.tasksRepository.save({
      title,
      description,
      examples,
      difficulty,
      tags,
      additional_materials,
      category,
    });

    const result = await this.tasksRepository.save(task);

    return result;
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
    });
  }
}
