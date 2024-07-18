import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksRepository } from '@infrastructure/repositories/tasks.repository';
import { TasksUsecase } from '@domain/usecases/tasks/tasks.usecase';
import { TaskStatus } from '@domain/models/task.interface';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: 424232244,
  username: 'Test user',
  password: 'Test password',
  tasks: []
};

describe('TasksUsecase', () => {
  let TasksUsecase: TasksUsecase;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksUsecase,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    TasksUsecase = module.get(TasksUsecase);
    tasksRepository = module.get(TasksRepository);
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
        id: '24FS',
        status: TaskStatus.OPEN,
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