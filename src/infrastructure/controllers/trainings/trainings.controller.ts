import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { GetUser } from '@infrastructure/common/user.decorator';
import { ApiResponseType } from '@infrastructure/common/swagger.decorator';
import { TrainingPresenter } from '@adapters/presenters/training.presenter';
import { TrainingDto, GetTrainingsFilterDto } from '@usecases/trainings/trainings.dto';
import { TrainingsControllerAdapter } from '@adapters/controllers/trainings.controller';
import { Training } from '@domain/models/training.interface';
import { User } from '@domain/models/user.interface';

@Controller('trainings')
@ApiTags('Trainings')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(TrainingPresenter)
@UseGuards(AuthGuard())
export class TrainingsController implements TrainingsControllerAdapter {
  private logger = new Logger();

  constructor(
    @Inject('TrainingsUsecase')
    private readonly TrainingsUsecase
  ) {}

  @Get()
  @ApiBody({
    type: GetTrainingsFilterDto,
    description: 'Json structure for user object',
  })
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(TrainingPresenter, true)
  async getTrainings(
    @Query() filterDto: GetTrainingsFilterDto,
    @GetUser() user: User
  ): Promise<Training[]> {
    const trainings = await this.TrainingsUsecase.getTrainings(filterDto, user);

    return trainings.map((training) => new TrainingPresenter(training));
  }

  @Get('/:id')
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(TrainingPresenter, true)
  async getTrainingById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<Training> {
    try {
      const training = await this.TrainingsUsecase.getTrainingById(id, user);

      if (training.authorId !== user.id) {
        const message = `Training with ID "${id}" not found.`;

        this.logger.error(message, "code_error: 404");
        throw new NotFoundException({ message, code_error: 404 });
      }

      if (!training) {
        const message = `Training with ID "${id}" not found.`;

        this.logger.error(message, "code_error: 404");
        throw new NotFoundException({ message, code_error: 404 });
      }

      return new TrainingPresenter(training);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @ApiBody({
    type: GetTrainingsFilterDto,
    description: 'Json structure for user object',
  })
  @ApiBody({
    type: TrainingDto,
    description: 'Json structure for training object',
  })
  @ApiResponseType(TrainingPresenter, true)
  async createTraining(
    @Body() training: TrainingDto,
    @GetUser() user: User,
  ): Promise<Training> {
    const createdTraining = await this.TrainingsUsecase.createTraining(training, user);

    return new TrainingPresenter(createdTraining);
  }

  @Delete('/:id')
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(TrainingPresenter, true)
  async deleteTraining(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Training> {
    const training = await this.TrainingsUsecase.deleteTraining(id, user);

    return new TrainingPresenter(training);
  }

  @Patch('/:id/update')
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiBody({
    type: TrainingDto,
    description: 'Json structure for training object',
  })
  @ApiResponseType(TrainingPresenter, true)
  async updateTraining(
    @Body() training: TrainingDto,
    @Param('id') trainingId: string,
    @GetUser() user: User
  ): Promise<Training> {
    const updatedTraining = await this.TrainingsUsecase.updateTraining(training, trainingId, user);

    return new TrainingPresenter(updatedTraining);
  }
}