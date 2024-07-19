import { ApiProperty } from '@nestjs/swagger';
import { Training } from '@domain/models/training.interface';

export class TrainingPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  authorId: string;

  constructor(training: Training) {
    this.id = training.id;
    this.createdAt = training.createdAt;
    this.updatedAt = training.updatedAt;
    this.title = training.title;
    this.description = training.description;
    this.authorId = training.authorId;
  }
}