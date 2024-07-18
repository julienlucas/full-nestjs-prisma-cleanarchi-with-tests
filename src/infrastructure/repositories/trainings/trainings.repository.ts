import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TrainingDto, GetTrainingsFilterDto } from '@infrastructure/repositories/trainings/trainings.dto';
import { PrismaService } from '@infrastructure/prisma/prisma.service';
import { Training } from '@domain/models/training.interface';
import { User } from '@domain/models/user.interface';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrainingsRepository {
  private logger = new Logger('TrainingsRepository', { timestamp: true });

  constructor(
    private prisma: PrismaService
  ) {}

  async getTrainings(filterDto: GetTrainingsFilterDto, user: User): Promise<Training[]> {
    const { search } = filterDto;

    // const query = this.createQueryBuilder('task');
    // query.where({ user });

    // if (status) {
    //   query.andWhere('task.status = :status', { status });
    // }

    // if (search) {
    //   query.andWhere(
    //     '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
    //     { search: `%${search}%` },
    //   );
    // }

    try {
      const trainings = await this.prisma.user.findUnique({ where: { email: user.email } })

      return trainings as any;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTraining(training: TrainingDto, user: User): Promise<Training> {
    const { title, description } = training;

    const createdTraining = await this.prisma.training.create({
      data: {
        title,
        description,
        createdAt: new Date()
        // user: {
        //   connect: {
        //     id: user.id
        //   }
        // }
      }
    })

    return createdTraining;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    // await this.delete({ id, user });
  }
}