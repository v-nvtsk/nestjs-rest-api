import { Test } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService, UserProfile } from './profiles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users, Tasks } from '../../entities';
import { Repository, SelectQueryBuilder } from 'typeorm';

describe('ProfilesController', () => {
  let profilesController: ProfilesController;
  let profilesService: ProfilesService;

  beforeEach(async () => {
    const usersRepositoryMock: Partial<Repository<Users>> = {
      findOne: jest.fn(),
    };

    const tasksQueryBuilderMock = {
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    } as unknown as SelectQueryBuilder<Tasks>;

    const tasksRepositoryMock = {
      createQueryBuilder: jest.fn(() => tasksQueryBuilderMock),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [ProfilesController],
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

    profilesService = moduleRef.get(ProfilesService);
    profilesController = moduleRef.get(ProfilesController);
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const result = {
        id: 1,
        role: 'role',
        username: 'test@test.com',
        status: 'registered',
        solutions: [],
        rating: 0,
      } as UserProfile;

      jest.spyOn(profilesService, 'getProfile').mockResolvedValue(result);

      expect(await profilesController.findOne(1)).toBe(result);
    });
  });
});
