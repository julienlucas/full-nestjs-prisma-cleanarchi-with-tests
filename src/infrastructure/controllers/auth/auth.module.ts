import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUsecase } from '@usecases/users/users.usecase';
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { UsersPrismaRepository } from '@infrastructure/prisma/users.prisma.repository';
import { JwtStrategy } from '@adapters/repositories/jwt.strategy';
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { PrismaModule } from '@infrastructure/prisma/prisma.module';

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
      provide: 'AuthUsecase',
      useClass: AuthUsecase,
    },
    {
      provide: 'UsersRepository',
      useClass: UsersPrismaRepository,
    },
    {
      provide: 'prisma',
      useClass: PrismaService
    }
  ],
  exports: [JwtStrategy, PassportModule]
})

export class AuthModule {}
