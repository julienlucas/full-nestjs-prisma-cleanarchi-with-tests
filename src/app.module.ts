import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from '@infrastructure/common/config.schema';
import { TrainingsModule } from '@infrastructure/controllers/trainings/trainings.module';
import { AuthModule } from '@infrastructure/controllers/auth/auth.module';
import { PrismaModule } from '@infrastructure/prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TrainingsModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema
    }),
  ]
})
export class AppModule {}
