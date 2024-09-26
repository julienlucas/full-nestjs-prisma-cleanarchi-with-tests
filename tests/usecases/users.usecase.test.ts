import { beforeAll, describe, expect, test, vi } from 'vitest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { AuthUsecase } from '@usecases/users/users.usecase';
import { JwtStrategy } from '@adapters/repositories/jwt.strategy';
import { userMock } from '@tests/mocks/mocks';

describe('Tests of Training usecases', () => {
  let authUsecase: AuthUsecase;

  let createUserMock = vi.fn();
  let signInMock = vi.fn();

  beforeAll(async () => {
    const UsersRepositoryProvider = {
      provide: 'UsersRepository',
      useValue: {
        createUser: createUserMock,
        signIn: signInMock,
      }
    };

    const AuthUsecaseProvider = {
      provide: 'AuthUsecase',
      useClass: AuthUsecase,
    };

    const JwtServiceProvider = {
      provide: JwtStrategy,
      useValue: {
        signin: vi.fn()
      }
    };

    const JwtStrategyProvider = {
      provide: JwtStrategy,
      useValue: {
        secretOrKey: process.env.JWT_SECRET
      }
    };

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async () => ({
            secret: process.env.JWT_SECRET
          })
        }),
      ],
      controllers: [AuthController],
      providers: [
        JwtServiceProvider,
        JwtStrategyProvider,
        {
          provide: 'Logger',
          useClass: Logger,
        },
        {
          provide: 'AuthUsecase',
          useClass: AuthUsecase,
        },
        UsersRepositoryProvider
      ]
    }).compile();

    authUsecase = app.get<AuthUsecase>('AuthUsecase');
  })

  test('AuthUsecase signUp should return user', async () => {
    //Arrange
    createUserMock.mockResolvedValue(userMock);

    //Act & Assert
    const result = await authUsecase.signUp(userMock);
    expect(result).toBe(userMock);
  });

  test('AuthUsecase signIn should return token', async () => {
    //Arrange
    signInMock.mockResolvedValue({
      ...userMock,
      password: "$2b$10$Hl.Q/auDp7Dcjx8/cmLXie/ZruMjypbKMJBvo94mcDzM0jYaWzqkm",
    });

    //Act & Assert
    const result = await authUsecase.signIn(userMock);
    expect(result).toEqual(expect.any(String));
  });
});