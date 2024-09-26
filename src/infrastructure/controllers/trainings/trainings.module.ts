import { Module, Logger } from '@nestjs/common';
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { TrainingsPrismaRepository } from '@infrastructure/prisma/trainings.prisma.repository';
import { TrainingsController } from '@infrastructure/controllers/trainings/trainings.controller';
import { AuthModule } from '@infrastructure/controllers/auth/auth.module';
import { PrismaModule } from '@infrastructure/prisma/prisma.module';
import { TrainingsUsecase } from '@usecases/trainings/trainings.usecase';

@Module({
  imports: [
    PrismaModule,
    AuthModule
  ],
  controllers: [TrainingsController],
  providers: [
    {
      provide: 'Logger',
      useClass: Logger,
    },
    {
      provide: 'TrainingsUsecase',
      useClass: TrainingsUsecase
    },
    {
      provide: 'TrainingsRepository',
      useClass: TrainingsPrismaRepository
    },
    {
      provide: 'prisma',
      useClass: PrismaService
    }
  ]
})
export class TrainingsModule {}