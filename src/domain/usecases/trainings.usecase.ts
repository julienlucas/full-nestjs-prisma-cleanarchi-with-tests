import {
  Inject,
  Injectable,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { Training } from '@domain/models/training.interface';
import { TrainingDto, GetTrainingsFilterDto } from '@infrastructure/repositories/trainings/trainings.dto';
import { User } from '@domain/models/user.interface';

@Injectable()
export class TrainingsUsecase {
  private logger = new Logger();

  constructor(
    @Inject('TrainingsRepository')
    private readonly trainingsRepository
  ) {}

  async getTrainings(filterDto?: GetTrainingsFilterDto, user?: User): Promise<Training[]> {
    const result = await this.trainingsRepository.getTrainings(filterDto, user);

    this.logger.verbose('getTrainingsUsecases', `User "${user.email}" retrieving all trainings. Filters: ${JSON.stringify(filterDto)}`);
    return result;
  }

  async getTrainingById(trainingId: string, user: User): Promise<Training> {
    const training = await this.trainingsRepository.getTrainingById(trainingId);

    if (!training) {
      const message = `Training with ID "${trainingId}" not found.`;

      this.logger.error(message, 'Code_error: 404');
      throw new NotFoundException({ message, code_error: 404 });
    }

    this.logger.verbose('getTrainingByIdUsecases', `User "${user.email}" retrieving training ID "${trainingId}`);
    return training;
  }
  async createTraining(training: TrainingDto, user: User): Promise<Training> {
    const result = await this.trainingsRepository.createTraining(training, user);

    this.logger.verbose('createTrainingUsecase', `User "${user.email}" creating a new training. Data: ${JSON.stringify(training)}`);
    return result;
  }

  async deleteTraining(trainingId: string, user: User): Promise<Training> {
    const result = await this.trainingsRepository.deleteTraining(trainingId);

    this.logger.verbose('deleteTrainingUsecase', `User "${user.email}" delete training. Data: ${JSON.stringify(result)}`);
    return result;
  }

  async updateTraining(training: TrainingDto, trainingId: string, user: User): Promise<Training> {
    const result = await this.trainingsRepository.updateTraining(training, trainingId, user);

    this.logger.verbose('updateTrainingUsecase', `User "${user.email}" updated training. Data: ${JSON.stringify(result)}`);
    return result;
  }
}
