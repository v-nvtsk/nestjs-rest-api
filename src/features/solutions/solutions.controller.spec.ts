import { Test, TestingModule } from '@nestjs/testing';
import { SolutionsController } from './solutions.controller';
import { SolutionsService } from './solutions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Solutions } from '../../entities';
import { Repository } from 'typeorm';

describe('SolutionsController', () => {
  let controller: SolutionsController;

  beforeEach(async () => {
    const solutionsRepositoryMock: Partial<Repository<Solutions>> = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolutionsController],
      providers: [
        SolutionsService,
        {
          provide: getRepositoryToken(Solutions),
          useValue: solutionsRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<SolutionsController>(SolutionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
