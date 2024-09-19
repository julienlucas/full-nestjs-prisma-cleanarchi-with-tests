import request from 'supertest';
import { beforeAll, afterAll, describe, expect, test } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import { userMock, emailMock, passwordMock } from "@tests/mocks/mocks";

describe('Tests of Training usecases', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
    .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/auth/signup should create a new user', async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: emailMock, password: passwordMock })
      .expect(201);

    const userCreated = JSON.parse(result.text);

    expect(userCreated).toEqual(expect.objectContaining({ email: emailMock }));
  });

  test('/auth/signin should return the right hashed token', async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: userMock.email, password: userMock.password })
      .expect(201);

    const expectedHash = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'

    const accessToken = JSON.parse(result.text).accessToken
    const hash = accessToken.substring(0, accessToken.indexOf("."));

    expect(hash).toEqual(expectedHash);
  });
});