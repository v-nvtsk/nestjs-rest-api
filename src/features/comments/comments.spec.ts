import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Repository } from 'typeorm';
import { Comments } from '../../entities';
import { Test, TestingModule } from '@nestjs/testing';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;

  beforeEach(async () => {
    const mockCommentsRepository = {} as Repository<Comments>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
        {
          provide: 'CommentsRepository',
          useValue: mockCommentsRepository,
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentsController = module.get<CommentsController>(CommentsController);
  });

  describe('getByTaskId', () => {
    it('should return an array of comments', async () => {
      const result = [
        {
          id: 0,
          task_id: 555,
          user_id: 1,
          username: 'test',
          content: 'test',
          created_at: new Date().toString(),
        },
      ];
      jest.spyOn(commentsService, 'getByTaskId').mockResolvedValue(result);

      expect(await commentsController.getById(1)).toBe(result);
    });
  });
});
