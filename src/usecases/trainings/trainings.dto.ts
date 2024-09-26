import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrainingDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}

export class GetTrainingsFilterDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  search: string;
}