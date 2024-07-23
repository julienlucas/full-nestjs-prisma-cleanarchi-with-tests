import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { TrainingsController } from '@infrastructure/controllers/trainings/trainings.controller';
import { TrainingsUsecase } from '@domain/usecases/trainings.usecase';
import { TrainingsRepository } from '@infrastructure/repositories/trainings/trainings.repository';
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { trainingsFakeData } from '@tests/fixtures/trainings.fakedata';

vi.mock('@infrastructure/presenters/training.presenter', async () => ({
  TrainingPresenter: vi.fn().mockImplementation((data) => data)
}));

const mockUser = {
  id: trainingsFakeData[0].authorId,
  username: 'Michael',
  password: 'Test password',
  email: "michael@jackson.com",
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Tests of Training usecases', () => {
  let trainingsController: TrainingsController;
  let trainingsUsecase: TrainingsUsecase;

  // beforeEach(() => {
  //   trainingsUsecase = new TrainingsUsecase(trainingsRepository);
  //   trainingsController = new TrainingsController(trainingsUsecase);
  //   trainingsRepository = new TrainingsRepository(trainingsRepository);
  // });

  const trainings = trainingsFakeData as any;

  let TrainingsRepository = vi.fn();
  TrainingsRepository.mockImplementation(() => ({
    getTrainings: () => trainings
  }));

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TrainingsController],
      providers: [
      TrainingsUsecase,
        {
          provide: 'TrainingsRepository',
          useClass: TrainingsRepository
        },
        {
          provide: 'prisma',
          useClass: PrismaService
        }
      ]
    })
    .compile();

    trainingsUsecase = moduleRef.get<TrainingsUsecase>(TrainingsUsecase);
    trainingsController = moduleRef.get<TrainingsController>(TrainingsController);
  });

  test('getTrainings, should return an array of trainings', async () => {
    const mockFilterDto = { search: "" };

    // vi.spyOn(trainingsUsecase, 'getTrainings').mockImplementation(() => trainings);
    expect(await trainingsController.getTrainings(mockFilterDto, mockUser)).toStrictEqual(trainings);
  });

  // test('getTrainingBytId, should return the right training', async () => {
  //   const training = trainingsFakeData[0] as any;
  //   const trainingId = trainingsFakeData[0].id

  //   vi.spyOn(trainingsUsecase, 'getTrainingById').mockImplementation(() => training);
  //   expect(await trainingsController.getTrainingById(trainingId, mockUser)).toStrictEqual(training);
  // });

  // test('createTraining, should return the right training created', async () => {
  //   const training = {
  //     title: "Un titre",
  //     description: "Une description"
  //   } as any;

  //   vi.spyOn(trainingsUsecase, 'createTraining').mockImplementation(() => training);
  //   expect(await trainingsController.createTraining(training, mockUser)).toStrictEqual(training);
  // });

  // test('deleteTraining, should return the training to delete', async () => {
  //   const trainingId = trainingsFakeData[0].id
  //   const training = trainingsFakeData[0] as any;

  //   vi.spyOn(trainingsUsecase, 'deleteTraining').mockImplementation(() => training);
  //   expect(await trainingsController.deleteTraining(trainingId, mockUser)).toStrictEqual(training);
  // });

  // test('updateTraining, should update the training', async () => {
  //   let training = trainingsFakeData[0] as any;
  //   let trainingId = trainingsFakeData[0].id;
  //   training = {
  //     title: "Nouveau titre",
  //     description: "Nouvelle description",
  //   };

  //   vi.spyOn(trainingsUsecase, 'updateTraining').mockImplementation(() => training);
  //   expect(await trainingsController.updateTraining(training, trainingId, mockUser)).toStrictEqual(training);
  // });
});