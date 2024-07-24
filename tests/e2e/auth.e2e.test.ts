import request from 'supertest';
import { beforeAll, afterAll, describe, expect, test, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from "@src/app.module";

describe('Tests of Training usecases', () => {
  let app: INestApplication;

  const generateRandomEmail = (length = 8) => Math.random().toString(20).substr(2, length);
  const generateRandomPassword = () => {
    const length = 8;
    const charset = "!@#$%&'()*+,^-./:;<=>?[]_`{~}|0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  const email = `${generateRandomEmail()}@julienlucas.com`;
  const password = generateRandomPassword();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
    .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('/auth/signup should create a new user', async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password })
      .expect(201);

    const userCreated = JSON.parse(result.text);

    expect(userCreated).toEqual(
      expect.objectContaining({ email })
    );
  });

  test('/auth/signin should return the right hashed token', async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);

    const expectedHash = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    const accessToken = JSON.parse(result.text).accessToken
    const hash = accessToken.substring(0, accessToken.indexOf("."));

    expect(hash).toEqual(expectedHash);
  });

  afterAll(async () => {
    await app.close();
  });
});