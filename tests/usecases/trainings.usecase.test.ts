import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { TrainingsRepository } from '@infrastructure/repositories/trainings/trainings.repository';
import { TrainingsController } from '@infrastructure/controllers/trainings/trainings.controller';
import { TrainingsUsecase } from '@domain/usecases/trainings.usecase';
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { trainingsFakeData } from '@tests/fixtures/trainings.fakedata';

const mockUser = {
  id: trainingsFakeData[0].authorId,
  username: 'Michael',
  password: 'Test password',
  email: "michael@jackson.com",
  createdAt: new Date(),
  updatedAt: new Date()
};

const trainings = trainingsFakeData as any;

describe('Tests of Training usecases', () => {
  let trainingsRepository: TrainingsRepository;
  let trainingsUsecase: TrainingsUsecase;

  // .mockImplementation(() => ({
  //   getTrainings: () => trainings
  // }));

  class ApiServiceMock {
    getTrainings() {
      return [];
    }
  };

  const findOne = vi.fn().mockImplementation(() => ({
    getTrainings() { return trainings }
  }));

  beforeAll(async () => {
    // const TrainingsRepositoryFactory = {
    //   provide: TrainingsRepository,
    //   useFactory: () => ({
    //     getTrainings: vi.fn(() => trainings),
    //     getTrainingById: vi.fn(() => []),
    //     createTraining: vi.fn(() => []),
    //     deleteTraining: vi.fn(() => []),
    //     updateTraining: vi.fn(() => [])
    //   })
    // };
    const TrainingsRepository = {
      provide: TrainingsUsecase,
      useFactory: () => ({
        getTrainings: vi.fn(() => trainings),
        getTrainingById: vi.fn(() => []),
        createTraining: vi.fn(() => []),
        deleteTraining: vi.fn(() => []),
        updateTraining: vi.fn(() => [])
      })
    };

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

    trainingsUsecase = app.get<TrainingsUsecase>(TrainingsUsecase);
  })

  test('getTrainings, should return an array of trainings', async () => {
    const mockFilterDto = { search: "" };

    trainingsUsecase.getTrainings(mockFilterDto, mockUser);
    // vi.spyOn(findOne, 'getTrainings').mockImplementation(() => trainings);
    expect(trainingsUsecase.getTrainings).toHaveReturnedWith(trainings);
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