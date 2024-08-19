import { Injectable } from '@nestjs/common';
import { AuthCrendentialsDto } from '@infrastructure/repositories/users/users.dto';
import { User } from '@domain/models/user.interface';

@Injectable()
export abstract class UsersRepository {
  abstract signIn(authCrendentialsDto: AuthCrendentialsDto): Promise<User>;
  abstract createUser(authCrendentialsDto: AuthCrendentialsDto): Promise<User>;
};