import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

export class CreateModuleDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Name can only contain letters, numbers, hyphens and underscores'
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 500, { message: 'Description cannot exceed 500 characters' })
  description?: string;
}