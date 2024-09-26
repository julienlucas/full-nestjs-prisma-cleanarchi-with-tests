import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { User } from '@domain/models/user.interface';
import { ConfigService } from '@nestjs/config';

export interface jwtPayload {
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload: jwtPayload): Promise<User> {
    const { email } = payload;

    const user: User = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}