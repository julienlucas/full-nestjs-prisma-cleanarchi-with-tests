import { TrainingDto, GetTrainingsFilterDto } from '@usecases/trainings/trainings.dto';
import { Training } from '@domain/models/training.interface';
import { User } from '@domain/models/user.interface';

export abstract class TrainingsControllerAdapter {
  abstract getTrainings(filterDto: GetTrainingsFilterDto, user: User): Promise<Training[]>;
  abstract getTrainingById(trainingId: string, user: User): Promise<Training>;
  abstract createTraining(training: TrainingDto, user: User): Promise<Training>;
  abstract updateTraining(training: TrainingDto, trainingId: string, user: User): Promise<Training>;
  abstract deleteTraining(trainingId: string, user: User): Promise<Training>;
}