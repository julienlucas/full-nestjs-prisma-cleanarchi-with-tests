import { factory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

const TRAININGS_COUNT = 5;

const trainingsIds = [
  "bfa984a9-66c9-4c20-91be-d69d9a6f1923",
  "4dcef045-66f5-4b8f-ba40-2a6f76f1f429",
  "46da46bf-b860-4360-a354-8290d15e9434",
  "bfe2dc45-503c-44a2-af4e-3d9cf004389e",
  "0d56d4f0-6260-4ed4-8ca1-c00dfe518a65",
];

const titles = [
  "Formation présentiel - Computer Science, les bases",
  "Formation - Computer Science, avancée",
  "Formation - CSS 4, les nouvelles possibilités",
  "Coaching présentiel - React, les bases",
  "Rencontre - Robert Martin, le père du clean code",
];

const authorIds = [
  "0834fcc7-b625-40ac-bdda-bdbe14b834aa",
  "bbcc2c42-0e3c-4619-ac29-4da4e1d7cde3",
  "d1719b59-cb47-4df8-8e7c-3e5305a90d7c",
  "538c70eb-ae58-424a-b002-69bc45eecbc8",
  "14ba82d5-401c-4ced-af4b-be04da908c1a"
];

export const db = factory({
  training: {
    id: primaryKey(String),
    title: String,
    description: String,
    createdAt: String,
    updatedAt: String,
    authorId: String,
  }
});

const generateTrainings = (index: number) => {
  return {
    id: trainingsIds[index],
    title: titles[index],
    description: faker.lorem.paragraph(3),
    createdAt: faker.date.anytime().toISOString(),
    updatedAt: faker.date.anytime().toISOString(),
    authorId: authorIds[index]
  }
};

export const trainingsFakeData = [... new Array(TRAININGS_COUNT)].map((_, index) => db.training.create(generateTrainings(index)));