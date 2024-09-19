import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { UsersRepository } from '@infrastructure/repositories/users/users.repository';
import { UsersPrismaRepository } from "@infrastructure/prisma/users.prisma.repository";
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { AuthUsecase } from '@domain/usecases/auth.usecase';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('Tests of Training usecases', () => {
  let usersRepository: UsersRepository;

  const email = "test@test.com";
  const password = "password";
  let findUniqueMock = vi.fn();
  let createMock = vi.fn();

  beforeAll(async () => {
    const PrismaProvider = {
      provide: 'prisma',
      useValue: {
        user: {
          findUnique: findUniqueMock,
          create: createMock,
        }
      }
    };

    const app: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: "jwt" })],
      controllers: [AuthController],
      providers: [
        JwtService,
        AuthUsecase,
        {
          provide: "UsersRepository",
          useClass: UsersPrismaRepository,
        },
        PrismaProvider,
      ],
    }).compile();

    usersRepository = app.get<UsersRepository>('UsersRepository');
  })

  test('UsersRepository signUp should return an array of trainings', async () => {
    //Act
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //Arrange
    createMock.mockResolvedValue({ email, password: hashedPassword });

    //Assert
    const result = await usersRepository.createUser({ email, password });
    expect(result).toStrictEqual({ email, password: hashedPassword });
  });

  test('UsersRepository signIn should return the right training', async () => {
    //Arrange
    const mockAuthenticationUser = { email, password };
    findUniqueMock.mockResolvedValue(mockAuthenticationUser);

    //Assert
    const result = await usersRepository.signIn(mockAuthenticationUser);
    expect(result).toBe(mockAuthenticationUser);
  });
});