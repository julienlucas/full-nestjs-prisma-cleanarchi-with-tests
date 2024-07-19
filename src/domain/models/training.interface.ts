import { Training as TrainingEntity } from '@prisma/client';

export class Training implements TrainingEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  authorId: string;
}