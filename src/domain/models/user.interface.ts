import { User as UserEntity } from '@prisma/client';

export class User implements UserEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
}

export class BearerToken {
  accessToken: string;
}
