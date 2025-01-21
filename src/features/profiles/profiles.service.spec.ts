import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tasks, Users } from '../../entities';
import { Repository, SelectQueryBuilder } from 'typeorm';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let usersRepositoryMock: Partial<Repository<Users>>;
  let tasksQueryBuilderMock: Partial<SelectQueryBuilder<Tasks>>;
  let tasksRepositoryMock: Partial<Repository<Tasks>>;

  beforeEach(async () => {
    tasksQueryBuilderMock = {
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };

    tasksRepositoryMock = {
      createQueryBuilder: jest.fn(
        () => tasksQueryBuilderMock as SelectQueryBuilder<Tasks>,
      ),
    };

    usersRepositoryMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: getRepositoryToken(Users),
          useValue: usersRepositoryMock,
        },
        {
          provide: getRepositoryToken(Tasks),
          useValue: tasksRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
