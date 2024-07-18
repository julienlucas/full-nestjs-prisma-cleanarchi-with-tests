import { Training } from '@domain/models/training.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  // @ApiProperty()
  // @OneToMany(_type => Training, training => training.user, { eager: true })
  // trainings: Training[];
}

export class BearerToken {
  @ApiProperty()
  token: string;
}
