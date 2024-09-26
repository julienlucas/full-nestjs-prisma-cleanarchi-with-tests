import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { faker } from '@faker-js/faker';
import { userMock } from '@tests/mocks/mocks';
import { TrainingsRepository } from '@adapters/repositories/trainings.repository';
import { TrainingsPrismaRepository } from "@infrastructure/prisma/trainings.prisma.repository";
import { TrainingsController } from '@infrastructure/controllers/trainings/trainings.controller';
import { TrainingsUsecase } from '@usecases/trainings/trainings.usecase';
import { trainingsFakeData } from '@tests/fixtures/trainings.fakedata';
import {
  MIN_LENGTH_TITLE,
  MAX_LENGTH_TITLE,
  MIN_LENGTH_DESCRIPTION
} from '@domain/entities/training.entity';

describe('Tests of Training repositories', () => {
  let trainingsRepository: TrainingsRepository;

  let findManyMock = vi.fn();
  let findUniqueMock = vi.fn();
  let createMock = vi.fn();
  let updateMock = vi.fn();
  let deleteMock = vi.fn();

  beforeAll(async () => {
    const PrismaProvider = {
      provide: "prisma",
      useValue: {
        training: {
          findMany: findManyMock,
          findUnique: findUniqueMock,
          create: createMock,
          update: updateMock,
          delete: deleteMock,
        },
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: "jwt" })],
      controllers: [TrainingsController],
      providers: [
        {
          provide: 'Logger',
          useClass: Logger,
        },
        {
          provide: 'TrainingsUsecase',
          useClass: TrainingsUsecase
        },
        {
          provide: "TrainingsRepository",
          useClass: TrainingsPrismaRepository,
        },
        PrismaProvider,
      ],
    }).compile();

    trainingsRepository = app.get<TrainingsRepository>("TrainingsRepository");
  });

  test("TrainingsRepository getTrainings should return an array of trainings", async () => {
    //Arrange
    const mockTrainings = trainingsFakeData;
    const mockFilterDto = { search: "" };
    findManyMock.mockResolvedValue(mockTrainings);

    //Act & Assert
    const result = await trainingsRepository.getTrainings(
      mockFilterDto,
      userMock
    );
    expect(result).toBe(mockTrainings);
  });

  test("TrainingsRepository getTrainingById, should return the right training", async () => {
    //Arrange
    const mockTraining = trainingsFakeData[2];
    findUniqueMock.mockResolvedValue(mockTraining);

    //Act & Assert
    const result = await trainingsRepository.getTrainingById(mockTraining.id);
    expect(result).toBe(mockTraining);
  });

  test("TrainingsRepository createTraining, should return the right training created", async () => {
    //Arrange
    let newTraining = {
      title: faker.string.alphanumeric(MIN_LENGTH_TITLE + 1),
      description: "",
    };
    createMock.mockResolvedValue(newTraining);

    //Act & Assert
    const result = await trainingsRepository.createTraining(
      newTraining,
      userMock
    );
    expect(result).toBe(newTraining);

    //Arrange
    newTraining = {
      title: faker.string.alphanumeric(MAX_LENGTH_TITLE + 1),
      description: faker.string.alphanumeric(MIN_LENGTH_DESCRIPTION + 1),
    };
    createMock.mockResolvedValue(newTraining);

    //Act & Assert
    await expect(
      trainingsRepository.createTraining(newTraining, userMock)
    ).rejects.toThrow();
  });

  test("TrainingsRepository deleteTraining, should delete the right training", async () => {
    //Arrange
    const trainingId = trainingsFakeData[3].id;
    deleteMock.mockResolvedValue(trainingId);

    //Act & Assert
    const result = await trainingsRepository.deleteTraining(trainingId);
    expect(result).toBe(trainingId);
  });

  test("TrainingsRepository updateTraining, should update the right training", async () => {
    //Arrange
    const trainingId = trainingsFakeData[2].id;
    const updateTraining = {
      title: faker.string.alphanumeric(),
      description: faker.string.alphanumeric(),
    };
    updateMock.mockResolvedValue(updateTraining);

    //Act & Assert
    const result = await trainingsRepository.updateTraining(
      updateTraining,
      trainingId,
      userMock
    );
    expect(result).toBe(updateTraining);
  });
});