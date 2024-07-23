import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TrainingDto, GetTrainingsFilterDto } from '@infrastructure/repositories/trainings/trainings.dto';
import { TrainingEntity } from '@domain/entities/training.entity';
import { Training } from '@domain/models/training.interface';
import { User } from '@domain/models/user.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class TrainingsRepository {
  private logger = new Logger('TrainingsRepository', { timestamp: true });

  constructor(
    @Inject('prisma')
    private prisma
  ) {}

  async getTrainings(filterDto: GetTrainingsFilterDto, user: User): Promise<Training[]> {
    const { search } = filterDto;

    try {
      const trainings = await this.prisma.training.findMany({
        where: {
          OR: [
            {
              authorId: user.id,
              title: { contains: search || '' }
            },
            {
              authorId: user.id,
              description: { contains: search || '' }
            },
          ]
        },
        orderBy: { createdAt: 'desc' }
      })

      return trainings;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  };

  async getTrainingById(trainingId: string): Promise<Training> {
    try {
      const training = await this.prisma.training.findUnique({
        where: {
          id: trainingId
        }
      })

      return training;
    } catch (error) {
      this.logger.error(`Failed to get training for id "${trainingId}"`, error.stack);
      throw new InternalServerErrorException();
    }
  };

  async createTraining(training: TrainingDto, user: User): Promise<Training> {
    const { title, description } = training;

    const trainingEntityInstance = TrainingEntity.getInstance();
    const checkIfCanBeSubmited = (trainingEntityInstance as TrainingEntity).canBeSubmited(training?.title, training?.description);

    this.logger.log(checkIfCanBeSubmited)

    if (checkIfCanBeSubmited) {
      try {
        const createdTraining = await this.prisma.training.create({
          data: {
            title,
            description,
            authorId: user.id
          }
        })

        return createdTraining;
      } catch (error) {
        this.logger.error(`Failed to create training for user "${user.email}"`, error.stack);
        throw new InternalServerErrorException();
      }
    }

    const message = "Training to create with not the max/min lengths title/description";

    this.logger.error(message, 'Code_error: 404');
    throw new NotFoundException({ message, code_error: 404 });
  }

  async updateTraining(training: TrainingDto, trainingId: string, user: User): Promise<Training> {
    const { title, description } = training;

    try {
      const updatedTraining = await this.prisma.training.update({
        where: {
          id: trainingId
        },
        data: {
          title,
          description,
        }
      })

      return updatedTraining;
    } catch (error) {
      this.logger.error(`Failed to update training for user "${user.email}"`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async deleteTraining(trainingId: string): Promise<Training> {
    try {
      const result = await this.prisma.training.delete({
        where: {
          id: trainingId
        }
      })

      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.error(`Training to delete for ID "${trainingId}" does not exist`, error.stack);
        throw new NotFoundException('Training to delete does not exist');
      } else {
        this.logger.error(`Failed to delete training for id "${trainingId}"`, error.stack);
        throw new InternalServerErrorException();
      }
    }
  }
}