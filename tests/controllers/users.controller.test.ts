import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { AuthUsecase } from '@domain/usecases/auth.usecase';
import { faker } from "@faker-js/faker";

describe('Tests of Training usecases', () => {
  let authController: AuthController;
  let authUsecaseSpy: AuthUsecase;

  const AuthRepository = {
    provide: AuthUsecase,
    useFactory: () => ({
      signUp: vi.fn(() => {}),
      signIn: vi.fn(() => '')
    })
  };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [AuthController],
      providers: [
        AuthUsecase,
        AuthRepository
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authUsecaseSpy = app.get<AuthUsecase>(AuthUsecase);
  })

  test('AuthController calling signup', async () => {
    //Arrange
    const email = faker.string.alphanumeric(10);
    const password = faker.string.alphanumeric(10);

    //Act
    authController.signUp({ email, password });

    //Assert
    expect(authUsecaseSpy.signUp).toHaveBeenCalled();
  });

    test('AuthController calling signup', async () => {
    //Arrange
    const email = faker.string.alphanumeric(10);
    const password = faker.string.alphanumeric(10);

    //Act
    authController.signIn({ email, password });

    //Assert
    expect(authUsecaseSpy.signIn).toHaveBeenCalled();
  });
});