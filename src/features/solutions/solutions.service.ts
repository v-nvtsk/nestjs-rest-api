import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Solutions } from '@/entities/solutions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SolutionsService {
  constructor(
    @InjectRepository(Solutions)
    private solutionsRepository: Repository<Solutions>,
  ) {}

  async create(item: {
    task_id: number;
    user_id: number;
    source_code: string;
  }) {
    return await this.solutionsRepository.save({
      ...item,
      created_at: new Date(),
    });
  }

  async findSolution(task_id: number, user_id: number) {
    return await this.solutionsRepository.findOne({
      where: {
        task: { id: task_id },
        user: { id: user_id },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} solution`;
  }

  update(id: number, mark: number) {
    this.solutionsRepository.update({ id }, { mark });
    return `This action updates a #${id} solution`;
  }

  remove(id: number) {
    return `This action removes a #${id} solution`;
  }
}
