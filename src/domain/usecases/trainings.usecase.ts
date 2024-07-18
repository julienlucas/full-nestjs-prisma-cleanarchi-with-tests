import {
  Injectable,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { Training } from '@domain/models/training.interface';
import { TrainingsRepository } from '@infrastructure/repositories/trainings/trainings.repository';
import { TrainingDto, GetTrainingsFilterDto } from '@infrastructure/repositories/trainings/trainings.dto';
import { User } from '@domain/models/user.interface';

@Injectable()
export class TrainingsUsecase {
  private logger = new Logger();

  constructor(
    private readonly trainingsRepository: TrainingsRepository,
  ) {}

  async getTasks(filterDto:  GetTrainingsFilterDto, user: User): Promise<Training[]> {
    const result = await this.trainingsRepository.getTrainings(filterDto, user);

    this.logger.verbose('tasksUsecases execute', `User "${user.email}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return result;
  }

  async getTaskById(id: string, user: User) {
  // async getTaskById(id: string, user: User): Promise<Task> {
    // const found = await this.tasksRepository.findOne({ where: { id, user } });

    // if (!found) {
    //   const message = `Task with ID "${id}" not found.`;

    //   this.logger.error(message, 'Code_error: 404');
    //   throw new NotFoundException({ message, code_error: 404 });
    // }

    // return found;
  }

  // async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
  async createTraining(training: TrainingDto, user: User) {

    console.log(user)

    const result = await this.trainingsRepository.createTraining(training, user);

    this.logger.verbose('tasksUsecases execute', `User "${user.email}" creating a new task. Data: ${JSON.stringify(training)}`);
    return result;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    // const result = await this.tasksRepository.delete({ id, user });

    // if(result.affected === 0) {
    //   const message = `Task with ID "${id}" not found.`;

    //   this.logger.error(message, 'Code_error: 404');
    //   throw new NotFoundException({ message, code_error: 404 });
    // }
  }

  // async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
  async updateTaskStatus(id: string, user: User) {
    // const task = await this.getTaskById(id, user);
    // task.status = status;
    // return this.tasksRepository.save({ id, status });
  }
}
