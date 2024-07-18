import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '@infrastructure/repositories/users/users.repository';
import { AuthCrendentialsDto } from '@infrastructure/repositories/users/users.dto';

@Injectable()
export class AuthUsecase {
  private logger = new Logger();

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) {}

  async signUp(authCrendentialsDto: AuthCrendentialsDto): Promise<void> {
    const result = await this.usersRepository.createUser(authCrendentialsDto);

    this.logger.verbose('authUsecases execute', `User created successfully`);
    return result;
  }

  async signIn(authCrendentialsDto: AuthCrendentialsDto): Promise<{ accessToken: string }> {
    const { email, password } = authCrendentialsDto;
    const user = await this.usersRepository.signIn(authCrendentialsDto);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email };
      const accessToken: string = await this.jwtService.sign(payload);

      this.logger.verbose('authUsecases execute', accessToken);
      this.logger.verbose('authUsecases execute', `User signin successfully`);

      return { accessToken };
    } else {
      const message = 'Please check your login credentials';
      this.logger.error(message, 'Code_error: 401');
      throw new UnauthorizedException({ message, code_error: 401 });
    }
  }
}
