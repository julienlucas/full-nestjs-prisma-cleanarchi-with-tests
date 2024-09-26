import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { UsersRepositoryAdapter } from '@adapters/repositories/users.repository';
import { UsersPrismaRepository } from "@infrastructure/prisma/users.prisma.repository";
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { AuthUsecase } from '@usecases/users/users.usecase';
import { userMock } from '@tests/mocks/mocks';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('Tests of Users repositories', () => {
  let usersRepository: UsersRepositoryAdapter;

  const email = userMock.email;
  const password = userMock.password;
  let findUniqueMock = vi.fn();
  let createMock = vi.fn();

  beforeAll(async () => {
    const PrismaProvider = {
      provide: 'prisma',
      useValue: {
        user: {
          findUnique: findUniqueMock,
          create: createMock,
        },
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: "jwt" })],
      controllers: [AuthController],
      providers: [
        JwtService,
        {
          provide: 'AuthUsecase',
          useClass: AuthUsecase
        },
        {
          provide: "UsersRepository",
          useClass: UsersPrismaRepository,
        },
        PrismaProvider,
      ],
    }).compile();

    usersRepository = app.get<UsersRepositoryAdapter>("UsersRepository");
  });

  test("UsersRepository signUp should return email and hashedPassword", async () => {
    //Arrange
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    createMock.mockResolvedValue({ email, password: hashedPassword });

    //Act & Assert
    const result = await usersRepository.createUser({ email, password });
    expect(result).toStrictEqual({ email, password: hashedPassword });
  });

  test("UsersRepository signIn should return the user", async () => {
    //Arrange
    const mockAuthenticationUser = { email, password };
    findUniqueMock.mockResolvedValue(mockAuthenticationUser);

    //Act & Assert
    const result = await usersRepository.signIn(mockAuthenticationUser);
    expect(result).toBe(mockAuthenticationUser);
  });
});