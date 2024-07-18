import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { GetUser } from '@infrastructure/common/user.decorator';
import { ApiResponseType } from '@infrastructure/common/swagger.decorator';
import { TrainingsUsecase } from '@domain/usecases/trainings.usecase';
import { TrainingDto, GetTrainingsFilterDto } from '@infrastructure/repositories/trainings/trainings.dto';
import { Training } from '@domain/models/training.interface';
import { User } from '@domain/models/user.interface';

@Controller('trainings')
@ApiTags('TrainingsController')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(Training)
@UseGuards(AuthGuard())
export class TrainingsController {
  constructor(
    private readonly TrainingsUsecase: TrainingsUsecase,
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
  @ApiResponseType(Training, true)
  getTasks(
    @Query() filterDto: GetTrainingsFilterDto,
    @GetUser() user: User
  ): Promise<Training[]> {
    return this.TrainingsUsecase.getTasks(filterDto, user);
  }

  @Get('/:id')
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(Training, true)
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User
  // ): Promise<Task> {
  ) {
    return this.TrainingsUsecase.getTaskById(id, user);
  }

  @Post()
  @ApiBody({
    type: GetTrainingsFilterDto,
    description: 'Json structure for user object',
  })
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(Training, true)
  createTraining(
    @Body() training: TrainingDto,
    @GetUser() user: User,
  ): Promise<Training> {
    return this.TrainingsUsecase.createTraining(training, user);
  }

  @Delete('/:id')
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(Training, true)
  deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.TrainingsUsecase.deleteTask(id, user);
  }

  // @Patch('/:id/status')
  // @ApiBody({
  //   type: User,
  //   description: 'user',
  // })
  // @ApiResponseType(Training, true)
  // updateTaskStatus(
  //   @Param('id') id: string,
  //   @GetUser() user: User,
  //   @Body() updateTaskStatusDto: UpdateTrainingStatusDto
  // // ): Promise<Task> {
  // ) {
  //   const { status } = updateTaskStatusDto;
  //   return this.TrainingsUsecase.updateTaskStatus(id, status, user);
  // }
}
