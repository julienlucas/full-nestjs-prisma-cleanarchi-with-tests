import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { AuthCrendentialsDto } from '@infrastructure/repositories/users/users.dto';
import { User } from '@domain/models/user.interface';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  private logger = new Logger('UsersRepository', { timestamp: true });

  constructor(private prisma: PrismaService) {}

  async signIn(authCrendentialsDto: AuthCrendentialsDto): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: authCrendentialsDto.email } })

      return user;
    } catch (error) {
      this.logger.error(`Failed to find user for "${authCrendentialsDto.email}"`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createUser(authCrendentialsDto: AuthCrendentialsDto): Promise<User> {
    const { email, password } = authCrendentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('salt', salt);
    console.log('hashedPassword', hashedPassword);

    try {
      const result = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword
        }
      })

      return result
    } catch(error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}