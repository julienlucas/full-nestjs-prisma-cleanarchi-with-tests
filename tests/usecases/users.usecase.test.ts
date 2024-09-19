import { beforeAll, describe, expect, test, vi } from 'vitest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { AuthUsecase } from '@domain/usecases/auth.usecase';
import { JwtStrategy } from '@infrastructure/repositories/jwt.strategy';
import { emailMock, passwordMock } from '@tests/mocks/mocks';

describe('Tests of Training usecases', () => {
  let authUsecase: AuthUsecase;

  const userMock = {
    email: emailMock,
    password: passwordMock
  };
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
        AuthUsecase,
        UsersRepositoryProvider
      ]
    }).compile();

    authUsecase = app.get<AuthUsecase>(AuthUsecase);
  })

  test('AuthUsecase signUp should return user', async () => {
    //Arrange
    createUserMock.mockResolvedValue(userMock);

    //Act
    const result = await authUsecase.signUp(userMock);

    //Assert
    expect(result).toBe(userMock);
  });

  test('AuthUsecase signIn should return token', async () => {
    //Arrange
    signInMock.mockResolvedValue({
      ...userMock,
      password: '$2b$10$jqlXGvXeJWH/bmYAOTGq5Ora/DbsYv4NxIfKK6q4hh9ERIY7MZ6ge'
    });

    //Act
    const result = await authUsecase.signIn(userMock);

    //Assert
    expect(result).toEqual(expect.any(String));
  });
});