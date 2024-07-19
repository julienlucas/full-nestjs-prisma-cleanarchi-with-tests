import { Module } from '@nestjs/common';
import { AuthUsecase } from '@domain/usecases/auth.usecase';
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { UsersRepository } from '@infrastructure/repositories/users/users.repository';
import { JwtStrategy } from '@infrastructure/repositories/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
  PrismaModule,
  ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600
        }
      })
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthUsecase,
    JwtStrategy,
    {
      provide: 'UsersRepository',
      useValue: UsersRepository
    }
  ],
  exports: [JwtStrategy, PassportModule]
})

export class AuthModule {}
