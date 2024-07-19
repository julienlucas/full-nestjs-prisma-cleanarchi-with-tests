import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TrainingsRepository } from '@infrastructure/repositories/trainings/trainings.repository';
import { TrainingsUsecase } from '@domain/usecases/trainings.usecase';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: 424232244,
  username: 'Test user',
  password: 'Test password',
  trainings: []
};

describe('TasksUsecase', () => {
  let TasksUsecase: TrainingsUsecase;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TrainingsUsecase,
        { provide: TrainingsRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    TasksUsecase = module.get(TrainingsUsecase);
    tasksRepository = module.get(TrainingsRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await TasksUsecase.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
        id: '24FS'
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await TasksUsecase.getTaskById('24FS', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(TasksUsecase.getTaskById('24FS', mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});