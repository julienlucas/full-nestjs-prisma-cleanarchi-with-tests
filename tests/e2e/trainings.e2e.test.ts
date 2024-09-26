import request from 'supertest';
import { beforeAll, afterAll, describe, expect, test } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { faker } from "@faker-js/faker";
import { AppModule } from "@src/app.module";
import { MIN_LENGTH_TITLE, MIN_LENGTH_DESCRIPTION } from '@domain/entities/training.entity';
import { userMock } from '@tests/mocks/mocks';

describe('Tests of Training usecases', () => {
  let app: INestApplication;
  let accessToken;
  let trainingId;
  let title = faker.string.alphanumeric(MIN_LENGTH_TITLE + 1);
  let description = faker.string.alphanumeric(MIN_LENGTH_DESCRIPTION + 1);

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

  test('/trainings POST should create and return a training', async () => {
    const resultToken = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: userMock.email, password: userMock.password })
      .expect(201);

    accessToken = JSON.parse(resultToken.text).accessToken;

    const result = await request(app.getHttpServer())
      .post('/trainings')
      .auth(accessToken, { type: 'bearer' })
      .send({ title, description })
      .expect(201);

    const training = JSON.parse(result.text);
    trainingId = training.id;

    expect(training).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        authorId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        title: expect.any(String),
        description: expect.any(String)
      })
    );
  });

  test('/trainings GET should return trainings array', async () => {
    const result = await request(app.getHttpServer())
      .get('/trainings')
      .auth(accessToken, { type: 'bearer' })
      .expect(200);

    const trainings = JSON.parse(result.text);

    expect(trainings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          authorId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          title: expect.any(String),
          description: expect.any(String)
        })
      ])
    );
  });

  test('/training UPDATE should update the training', async () => {
    title = faker.string.alphanumeric(MIN_LENGTH_TITLE + 1);
    description = faker.string.alphanumeric(MIN_LENGTH_DESCRIPTION + 1);

    const result = await request(app.getHttpServer())
      .patch(`/trainings/${trainingId}/update`)
      .auth(accessToken, { type: 'bearer' })
      .send({ title, description })
      .expect(200);

    const training = JSON.parse(result.text);

    expect(training).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        authorId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        title: expect.any(String),
        description: expect.any(String)
      })
    );
  });

  test('/training GET should return the training object of trainingId', async () => {
    const result = await request(app.getHttpServer())
      .get(`/trainings/${trainingId}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(200);

    const training = JSON.parse(result.text);

    await expect(training).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        authorId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        title: expect.any(String),
        description: expect.any(String)
      })
    );
  });

  test('/training DELETE should delete the training', async () => {
    await request(app.getHttpServer())
      .delete(`/trainings/${trainingId}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(200);
  });
});