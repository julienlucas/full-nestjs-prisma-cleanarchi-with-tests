import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TrainingsController } from '@infrastructure/controllers/trainings/trainings.controller';
import { TrainingsUsecase } from '@domain/usecases/trainings.usecase';
import { trainingsFakeData } from '@tests/fixtures/trainings.fakedata';
import { userMock } from '@tests/mocks/mocks';

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
      controllers: [TrainingsController],
      providers: [
        TrainingsUsecase,
        TrainingsRepositoryProvider
      ],
    }).compile();

    trainingsUsecase = app.get<TrainingsUsecase>(TrainingsUsecase);
  })

  test('TrainingUsecase getTrainings, should return an array of trainings', async () => {
    //Arrange
    const mockFilterDto = { search: "" };
    const trainings = trainingsFakeData;
    getTrainingsMock.mockResolvedValue(trainings);

    //Assert
    const result = await trainingsUsecase.getTrainings(mockFilterDto, userMock);
    expect(result).toBe(trainings);
  });

  test('TrainingUsecase getTrainingById, should return the right training', async () => {
    //Arrange
    const trainingId = trainingsFakeData[2].id;
    getTrainingByIdMock.mockResolvedValue(trainingId);

    //Assert
    const result = await trainingsUsecase.getTrainingById(trainingId, userMock);
    expect(result).toBe(trainingId);
  });

  test('TrainingUsecase createTraining, should return the right training created', async () => {
    //Arrange
    const newTraining = {
      title: "Un titre",
      description: "Une description"
    };
    createTrainingMock.mockResolvedValue(newTraining);

    //Assert
    const result = await trainingsUsecase.createTraining(newTraining, userMock);
    expect(result).toBe(newTraining);
  });

  test('TrainingUsecase deleteTraining, should return the training to delete', async () => {
    //Arrange
    const trainingId = trainingsFakeData[3].id;
    deleteTrainingMock.mockResolvedValue(trainingId);

    //Assert
    const result = await trainingsUsecase.deleteTraining(trainingId, userMock);
    expect(result).toBe(trainingId);
  });

  test('TrainingUsecase updateTraining, should update the training', async () => {
    //Arrange
    const trainingId = trainingsFakeData[2].id;
    const updateTraining = {
      title: "Un nouveau titre",
      description: "Une nouvelle description"
    };
    updateTrainingMock.mockResolvedValue(updateTraining);

    //Assert
    const result = await trainingsUsecase.updateTraining(
      updateTraining,
      trainingId,
      userMock
    );
    expect(result).toBe(updateTraining);
  });
});