import { trainingsFakeData } from '@tests/fixtures/trainings.fakedata';
import { faker } from '@faker-js/faker';

export const firstNameMock = faker.person.firstName();
export const lastNameMock = faker.person.lastName();
export const passwordMock = faker.helpers.fromRegExp(
  '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\\]:;<>,.?/~_+-=|]).{8,32}$'
);

export const emailMock = faker.internet.email({
  firstName: firstNameMock,
  lastName: lastNameMock,
  allowSpecialCharacters: false
});

// Mock for user already in database
export const userMock = {
  id: trainingsFakeData[0].authorId,
  password: "superP4ssword#",
  email: "hello@julienlucas.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};
