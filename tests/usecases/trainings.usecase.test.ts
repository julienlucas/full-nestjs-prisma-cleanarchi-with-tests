import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { TrainingsController } from '@infrastructure/controllers/trainings/trainings.controller';
import { TrainingsUsecase } from '@domain/usecases/trainings.usecase';
import { trainingsFakeData } from '@tests/fixtures/trainings.fakedata';

const mockUser = {
  id: trainingsFakeData[0].authorId,
  username: 'Michael',
  password: 'Test password',
  email: "michael@jackson.com",
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockTrainings = trainingsFakeData as any;
const mockTraining = trainingsFakeData[2];
const mockTrainingToDelete = trainingsFakeData[3];
const mockTrainingToCreate = {
  title: "Un titre",
  description: "Une description"
};
const mockTrainingToUpdate = {
  ...trainingsFakeData[2],
  title: "Un nouveau titre",
  description: "Une nouvelle description"
};

describe('Tests of Training usecases', () => {
  let trainingsUsecase: TrainingsUsecase;

  let getTrainingsMock = vi.fn();
  let getTrainingByIdMock = vi.fn();
  let createTrainingMock = vi.fn();
  let updateTrainingMock = vi.fn();
  let deleteTrainingMock = vi.fn();

  beforeAll(async () => {
    const TrainingsRepositoryProvider = {
      provide: 'TrainingsRepository',
      useValue: {
        getTrainings: getTrainingsMock,
        getTrainingById: getTrainingByIdMock,
        createTraining: createTrainingMock,
        updateTraining: updateTrainingMock,
        deleteTraining: deleteTrainingMock
      }
    };

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [TrainingsController],
      providers: [
        TrainingsUsecase,
        TrainingsRepositoryProvider
      ],
    }).compile();

    trainingsUsecase = app.get<TrainingsUsecase>(TrainingsUsecase);
  })

  test('getTrainings, should return an array of trainings', async () => {
    //Arrange
    const mockFilterDto = { search: "" };
    getTrainingsMock.mockResolvedValue(mockTrainings);

    //Assert
    const result = await trainingsUsecase.getTrainings(mockFilterDto, mockUser);
    expect(result).toBe(mockTrainings);
  });

  test('getTrainingById, should return the right training', async () => {
    //Arrange
    getTrainingByIdMock.mockResolvedValue(mockTraining);

    //Assert
    const result = await trainingsUsecase.getTrainingById(mockTraining.id, mockUser);
    expect(result).toBe(mockTraining);
  });

  test('createTraining, should return the right training created', async () => {
    //Arrange
    createTrainingMock.mockResolvedValue(mockTrainingToCreate);

    //Assert
    const result = await trainingsUsecase.createTraining(mockTrainingToCreate, mockUser);
    expect(result).toBe(mockTrainingToCreate);
  });

  test('deleteTraining, should return the training to delete', async () => {
    //Arrange
    deleteTrainingMock.mockResolvedValue(mockTrainingToDelete);

    //Assert
    const result = await trainingsUsecase.deleteTraining(mockTrainingToDelete.id, mockUser);
    expect(result).toBe(mockTrainingToDelete);
  });

  test('updateTraining, should update the training', async () => {
    //Arrange
    updateTrainingMock.mockResolvedValue(mockTrainingToUpdate);

    //Assert
    const result = await trainingsUsecase.updateTraining(mockTrainingToUpdate, mockTrainingToUpdate.id, mockUser);
    expect(result).toBe(mockTrainingToUpdate);
  });
});