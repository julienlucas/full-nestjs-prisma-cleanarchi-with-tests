import { Module } from '@nestjs/common';
import { TrainingsController } from '@infrastructure/controllers/trainings/trainings.controller';
import { TrainingsRepository } from '@infrastructure/repositories/trainings/trainings.repository';
import { TrainingsUsecase } from '@domain/usecases/trainings.usecase';
import { AuthModule } from '@infrastructure/controllers/auth/auth.module';
import { PrismaModule } from '@infrastructure/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule
  ],
  controllers: [TrainingsController],
  providers: [TrainingsUsecase, TrainingsRepository],
})
export class TrainingsModule {}