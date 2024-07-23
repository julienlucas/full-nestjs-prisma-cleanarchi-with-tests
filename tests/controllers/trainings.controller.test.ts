import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TrainingsController } from '@infrastructure/controllers/trainings/trainings.controller';
import { TrainingsUsecase } from '@domain/usecases/trainings.usecase';
import { trainingsFakeData } from '@tests/fixtures/trainings.fakedata';
import { PassportModule } from '@nestjs/passport';

describe('Tests of Training usecases', () => {
  let trainingsController: TrainingsController;
  let trainingsUsecaseSpy: TrainingsUsecase;

  const mockUser = {
    id: trainingsFakeData[0].authorId,
    username: 'Michael',
    password: 'Test password',
    email: "michael@jackson.com",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const trainings = trainingsFakeData as any;

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

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [TrainingsController],
      providers: [
        TrainingsUsecase,
        TrainingsRepository
      ],
    }).compile();

    trainingsController = app.get<TrainingsController>(TrainingsController);
    trainingsUsecaseSpy = app.get<TrainingsUsecase>(TrainingsUsecase);
  })

  test('TrainingsUsecase - calling getTrainings method', async () => {
    const mockFilterDto = { search: "" };

    trainingsController.getTrainings(mockFilterDto, mockUser);
    expect(trainingsUsecaseSpy.getTrainings).toHaveBeenCalled();
  });

  test('TrainingsUsecase - calling getTrainingById method', async () => {
    const trainingId = trainingsFakeData[0].id

    trainingsController.getTrainingById(trainingId, mockUser);
    expect(trainingsUsecaseSpy.getTrainingById).toHaveBeenCalledWith(trainingId, mockUser);
  });

  test('TrainingsUsecase - calling createTraining method', async () => {
    const training = {
      title: "Un titre",
      description: "Une description"
    };

    trainingsController.createTraining(training, mockUser);
    expect(trainingsUsecaseSpy.createTraining).toHaveBeenCalledWith(training, mockUser);
  });

  test('TrainingsUsecase - calling deleteTraining method', async () => {
    const trainingId = trainingsFakeData[0].id

    trainingsController.deleteTraining(trainingId, mockUser);
    expect(trainingsUsecaseSpy.deleteTraining).toHaveBeenCalledWith(trainingId, mockUser);
  });

  test('TrainingsUsecase - calling updateTraining method', async () => {
    let trainingId = trainingsFakeData[0].id;
    const training = {
      title: "Nouveau titre",
      description: "Nouvelle description",
    };

    trainingsController.updateTraining(training, trainingId, mockUser);
    expect(trainingsUsecaseSpy.updateTraining).toHaveBeenCalledWith(training, trainingId, mockUser);
  });
});