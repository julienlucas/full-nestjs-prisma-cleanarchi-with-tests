import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUsecase } from '@usecases/users/users.usecase';
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { UsersPrismaRepository } from '@infrastructure/prisma/users.prisma.repository';
import { JwtStrategy } from '@adapters/repositories/jwt.strategy';
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { PrismaModule } from '@infrastructure/prisma/prisma.module';

import { JwtService } from '@nestjs/jwt';

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
    JwtStrategy,
    {
      provide: 'Logger',
      useClass: Logger,
    },
    {
      provide: 'prisma',
      useClass: PrismaService
    },
    {
      provide: 'AuthUsecase',
      useClass: AuthUsecase,
    },
    {
      provide: 'UsersRepository',
      useClass: UsersPrismaRepository,
    }
  ],
  exports: [JwtStrategy, PassportModule]
})

export class AuthModule {}
