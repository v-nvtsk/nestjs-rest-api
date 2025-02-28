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

    const { rating } = userData;

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

  async updateProfileRating(id: number, rating: number) {
    return await this.usersRepository.update(id, { rating });
  }

  async updateProfile(id: number, profile: Partial<Users>): Promise<Users> {
    // Фильтруем нежелательные поля
    const { id: _, username: __, ...safeProfile } = profile;

    // Загружаем существующий профиль с отношением role
    const existingProfile = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Обновляем только безопасные поля
    if (safeProfile.password !== undefined)
      existingProfile.password = safeProfile.password;
    if (safeProfile.role !== undefined) existingProfile.role = safeProfile.role; // Обновляем отношение
    if (safeProfile.state !== undefined)
      existingProfile.state = safeProfile.state;
    if (safeProfile.rating !== undefined)
      existingProfile.rating = safeProfile.rating;

    // Сохраняем изменения
    return await this.usersRepository.save(existingProfile);
  }
}
