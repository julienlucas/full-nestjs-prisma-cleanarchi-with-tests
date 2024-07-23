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

const mockTrainings = trainingsFakeData;
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
  let trainingsRepository: TrainingsRepository;
  let trainingsUsecase: TrainingsUsecase;
  let prismaService: PrismaService;
  let findManyMock = vi.fn();
  let findUniqueMock = vi.fn();


  beforeAll(async () => {
    // const TrainingsRepositoryProvider = {
    //   provide: 'TrainingsRepository',
    //   useFactory: () => ({
    //     getTrainings: vi.fn(() => mockTrainings),
    //     getTrainingById: vi.fn(() => mockTrainingById),
    //     createTraining: vi.fn(() => mockTraining),
    //     deleteTraining: vi.fn(() => mockTrainingToDelete),
    //     updateTraining: vi.fn(() => mockTrainingToUpdate)
    //   })
    // };

    const PrismaProvider = {
      provide: 'prisma',
      useValue: {
        training: {
          findMany: findManyMock,
          findUnique: findUniqueMock
        }
      }
    };

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [TrainingsController],
      providers: [
        TrainingsUsecase,
        // TrainingsRepositoryProvider,
        {
          provide: 'TrainingsRepository',
          useClass: TrainingsRepository
        },
        PrismaProvider
        // {
        //   provide: 'prisma',
        //   useClass: PrismaService
        // }
      ],
    }).compile();

    trainingsUsecase = app.get<TrainingsUsecase>(TrainingsUsecase);
    trainingsRepository = app.get<TrainingsRepository>('TrainingsRepository');
    prismaService = app.get<PrismaService>('prisma');
  })

  test('TrainingsRepository getTrainings should return an array of trainings', async () => {
    const mockFilterDto = { search: "" };

     findManyMock.mockResolvedValue(mockTrainings);

    // trainingsRepository.getTrainings(mockFilterDto, mockUser);
    // expect(prismaService.training.findMany).toHaveBeenCalledTimes(2);
    // expect(trainingsRepository.getTrainings).toHaveReturnedWith(mockTrainings);
    const result = await trainingsRepository.getTrainings(mockFilterDto, mockUser);
    expect(result).toBe(mockTrainings);
  });

  test('TrainingsRepository getTrainingBytId, should return the right training', async () => {
    // trainingsRepository.getTrainingById(mockTrainingById.id);
    // expect(trainingsRepository.getTrainingById).toHaveReturnedWith(mockTrainingById);

    findUniqueMock.mockResolvedValue(mockTraining);
    const result = await trainingsRepository.getTrainingById(mockTraining.id);
    expect(result).toBe(mockTraining);
  });

  // test('TrainingsRepository createTraining, should return the right training created', async () => {
  //   trainingsRepository.createTraining(mockTraining, mockUser);
  //   expect(trainingsRepository.createTraining).toHaveReturnedWith(mockTraining);
  // });

  // test('TrainingsRepository deleteTraining, should delete the right training', async () => {
  //   trainingsRepository.deleteTraining(mockTrainingToDelete.id);
  //   expect(trainingsRepository.deleteTraining).toHaveReturnedWith(mockTrainingToDelete);
  // });

  // test('TrainingsRepository updateTraining, should delete the right training', async () => {
  //   trainingsRepository.updateTraining(mockTrainingToUpdate, mockTrainingById.id, mockUser);
  //   expect(trainingsRepository.updateTraining).toHaveReturnedWith(mockTrainingToUpdate);
  // });
});