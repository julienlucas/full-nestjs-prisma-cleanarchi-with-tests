import { AuthCrendentialsDto } from '@usecases/users/users.dto';
import { User } from '@domain/models/user.interface';

export abstract class UsersRepository {
  abstract signIn(authCrendentialsDto: AuthCrendentialsDto): Promise<User>;
  abstract createUser(authCrendentialsDto: AuthCrendentialsDto): Promise<User>;
};