import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TrainingsController } from '@infrastructure/controllers/trainings/trainings.controller';
import { TrainingsUsecase } from '@usecases/trainings/trainings.usecase';
import { trainingsFakeData } from '@tests/fixtures/trainings.fakedata';
import { PassportModule } from '@nestjs/passport';
import { userMock } from '@tests/mocks/mocks';
import { faker } from '@faker-js/faker';

describe('Tests of Training usecases', () => {
  let trainingsController: TrainingsController;
  let trainingsUsecaseSpy: TrainingsUsecase;

  const TrainingsRepository = {
    provide: TrainingsUsecase,
    useFactory: () => ({
      getTrainings: vi.fn(() => []),
      getTrainingById: vi.fn(() => []),
      createTraining: vi.fn(() => []),
      deleteTraining: vi.fn(() => []),
      updateTraining: vi.fn(() => [])
    })
  };

  const TrainingsUsecaseProvider = {
    provide: 'TrainingsUsecase',
    useFactory: () => ({
      getTrainings: vi.fn(() => []),
      getTrainingById: vi.fn(() => []),
      createTraining: vi.fn(() => []),
      deleteTraining: vi.fn(() => []),
      updateTraining: vi.fn(() => [])
    })
  };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [TrainingsController],
      providers: [TrainingsUsecaseProvider, TrainingsRepository],
    }).compile();

    trainingsController = app.get<TrainingsController>(TrainingsController);
    trainingsUsecaseSpy = app.get<TrainingsUsecase>('TrainingsUsecase');
  })

  test('TrainingsController calling getTrainings method', async () => {
    //Arrange
    const mockFilterDto = { search: "" };

    //Act & Assert
    trainingsController.getTrainings(mockFilterDto, userMock);
    expect(trainingsUsecaseSpy.getTrainings).toHaveBeenCalled();
  });

  test('TrainingsController calling getTrainingById method', async () => {
    //Arrange
    const trainingId = trainingsFakeData[0].id

    //Act & Assert
    trainingsController.getTrainingById(trainingId, userMock);
    expect(trainingsUsecaseSpy.getTrainingById).toHaveBeenCalledWith(trainingId, userMock);
  });

  test('TrainingsController calling createTraining method', async () => {
    //Arrange
    const training = {
      title: faker.string.alphanumeric(),
      description: faker.string.alphanumeric()
    };

    //Act & Assert
    trainingsController.createTraining(training, userMock);
    expect(trainingsUsecaseSpy.createTraining).toHaveBeenCalledWith(training, userMock);
  });

  test('TrainingsController calling deleteTraining method', async () => {
    //Arrange
    const trainingId = trainingsFakeData[0].id

    //Act & Assert
    trainingsController.deleteTraining(trainingId, userMock);
    expect(trainingsUsecaseSpy.deleteTraining).toHaveBeenCalledWith(trainingId, userMock);
  });

  test('TrainingsController calling updateTraining method', async () => {
    //Arrange
    let trainingId = trainingsFakeData[0].id;
    const training = {
      title: faker.string.alphanumeric(),
      description: faker.string.alphanumeric()
    };

    //Act & Assert
    trainingsController.updateTraining(training, trainingId, userMock);
    expect(trainingsUsecaseSpy.updateTraining).toHaveBeenCalledWith(training, trainingId, userMock);
  });
});