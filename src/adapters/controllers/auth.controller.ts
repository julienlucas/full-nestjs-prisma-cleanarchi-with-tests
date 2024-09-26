import { User, BearerToken } from '@domain/models/user.interface';
import { AuthCrendentialsDto } from '@usecases/users/users.dto';

export abstract class AuthControllerAdapter {
  abstract signUp(authCrendentialsDto: AuthCrendentialsDto): Promise<User>;
  abstract signIn(authCrendentialsDto: AuthCrendentialsDto): Promise<BearerToken>;
}