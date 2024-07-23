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
    const trainings = trainingsFakeData;
    getTrainingsMock.mockResolvedValue(trainings);

    //Assert
    const result = await trainingsUsecase.getTrainings(mockFilterDto, mockUser);
    expect(result).toBe(trainings);
  });

  test('getTrainingById, should return the right training', async () => {
    //Arrange
    const trainingId = trainingsFakeData[2].id;
    getTrainingByIdMock.mockResolvedValue(trainingId);

    //Assert
    const result = await trainingsUsecase.getTrainingById(trainingId, mockUser);
    expect(result).toBe(trainingId);
  });

  test('createTraining, should return the right training created', async () => {
    //Arrange
    const newTraining = {
      title: "Un titre",
      description: "Une description"
    };
    createTrainingMock.mockResolvedValue(newTraining);

    //Assert
    const result = await trainingsUsecase.createTraining(newTraining, mockUser);
    expect(result).toBe(newTraining);
  });

  test('deleteTraining, should return the training to delete', async () => {
    //Arrange
    const trainingId = trainingsFakeData[3].id;
    deleteTrainingMock.mockResolvedValue(trainingId);

    //Assert
    const result = await trainingsUsecase.deleteTraining(trainingId, mockUser);
    expect(result).toBe(trainingId);
  });

  test('updateTraining, should update the training', async () => {
    //Arrange
    const trainingId = trainingsFakeData[2].id;
    const updateTraining = {
      title: "Un nouveau titre",
      description: "Une nouvelle description"
    };
    updateTrainingMock.mockResolvedValue(updateTraining);

    //Assert
    const result = await trainingsUsecase.updateTraining(updateTraining, trainingId, mockUser);
    expect(result).toBe(updateTraining);
  });
});