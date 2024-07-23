import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { TrainingsRepository } from '@infrastructure/repositories/trainings/trainings.repository';
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

  let findManyMock = vi.fn();
  let findUniqueMock = vi.fn();
  let createMock = vi.fn();
  let updateMock = vi.fn();
  let deleteMock = vi.fn();

  beforeAll(async () => {
    const PrismaProvider = {
      provide: 'prisma',
      useValue: {
        training: {
          findMany: findManyMock,
          findUnique: findUniqueMock,
          create: createMock,
          update: updateMock,
          delete: deleteMock,
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
        {
          provide: 'TrainingsRepository',
          useClass: TrainingsRepository
        },
        PrismaProvider
      ],
    }).compile();

    trainingsRepository = app.get<TrainingsRepository>('TrainingsRepository');
  })

  test('TrainingsRepository getTrainings should return an array of trainings', async () => {
    //Arrange
    const mockFilterDto = { search: "" };
    findManyMock.mockResolvedValue(mockTrainings);

    //Assert
    const result = await trainingsRepository.getTrainings(mockFilterDto, mockUser);
    expect(result).toBe(mockTrainings);
  });

  test('TrainingsRepository getTrainingById, should return the right training', async () => {
    //Arrange
    findUniqueMock.mockResolvedValue(mockTraining);

    //Assert
    const result = await trainingsRepository.getTrainingById(mockTraining.id);
    expect(result).toBe(mockTraining);
  });

  test('TrainingsRepository createTraining, should return the right training created', async () => {
    //Arrange
    createMock.mockResolvedValue(mockTrainingToCreate);

    //Assert
    const result = await trainingsRepository.createTraining(mockTrainingToCreate, mockUser);
    expect(result).toBe(mockTrainingToCreate);
  });

  test('TrainingsRepository deleteTraining, should delete the right training', async () => {
    //Arrange
    deleteMock.mockResolvedValue(mockTrainingToDelete);

    //Assert
    const result = await trainingsRepository.deleteTraining(mockTrainingToDelete.id);
    expect(result).toBe(mockTrainingToDelete);
  });

  test('TrainingsRepository updateTraining, should delete the right training', async () => {
    //Arrange
    updateMock.mockResolvedValue(mockTrainingToUpdate);

    //Assert
    const result = await trainingsRepository.updateTraining(mockTrainingToUpdate, mockTraining.id, mockUser);
    expect(result).toBe(mockTrainingToUpdate);
  });
});