import { Test, TestingModule } from '@nestjs/testing';
import { SolutionsService } from './solutions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solutions } from '@/entities';

describe('SolutionsService', () => {
  let service: SolutionsService;
  let repositoryMock: Partial<Repository<Solutions>>;

  beforeEach(async () => {
    repositoryMock = {
      find: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolutionsService,
        {
          provide: getRepositoryToken(Solutions),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<SolutionsService>(SolutionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
