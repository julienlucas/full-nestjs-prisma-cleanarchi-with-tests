import { ApiProperty } from '@nestjs/swagger';
import { User } from '@domain/models/user.interface';

export class UserPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  constructor(user: User) {
    this.id = user.id;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.email = user.email;
    this.password = user.password;
  }
}

export class BearerTokenPresenter {
  @ApiProperty()
  accesstoken: string;

  constructor(accesstoken: string) {
    this.accesstoken = accesstoken;
  }
}