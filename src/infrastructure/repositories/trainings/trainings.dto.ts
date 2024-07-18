import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class TrainingDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

export class GetTrainingsFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}