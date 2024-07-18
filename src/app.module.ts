import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from '@infrastructure/common/config.schema';
import { TrainingsModule } from '@infrastructure/controllers/trainings/trainings.module';
import { AuthModule } from '@infrastructure/controllers/auth/auth.module';
import { PrismaModule } from '@infrastructure/prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      // envFilePath: [`.env.stage.${process.env.STAGE}`],
      envFilePath: [`.env.stage.dev`],
      validationSchema: configValidationSchema,
    }),
    PrismaModule,
    TrainingsModule
  ],
})
export class AppModule {}
