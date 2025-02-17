import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tasks, Users } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Filter } from './profiles.controller';

interface SolutionInfo {
  id: number;
  title: string;
  mark: number;
}

export interface UserProfile {
  id: number;
  username: string;
  role: string;
  status: string;
  rating: number;
  solutions: SolutionInfo[];
}

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
  ) {}

  async getProfile(id: number): Promise<UserProfile> {
    const userData = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    const userId = userData.id;

    const solutions: SolutionInfo[] = await this.tasksRepository
      .createQueryBuilder('tasks')
      .select([
        'tasks.id AS id',
        'tasks.title AS title',
        'solutions.mark AS mark',
      ])
      .innerJoin(
        'solutions',
        'solutions',
        'solutions.task = tasks.id AND solutions.user_id = :id',
        { id },
      )
      .getRawMany();

    const rating = solutions.reduce((sum, { mark }) => {
      return (sum += mark);
    }, 0);

    const profile: UserProfile = {
      id: userId,
      username: userData.username,
      role: userData.role.name,
      status: userData.state,
      rating,
      solutions,
    };

    return profile;
  }

  async getProfiles(filter: Filter) {
    return await this.usersRepository.find({
      where: { role: { name: filter.role } },
      relations: ['role'],
    });
  }
}
