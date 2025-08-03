import { IsString, IsNotEmpty, IsOptional, Length, IsUrl, Matches } from 'class-validator';

export class CreateWateringGroupDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl: string;
}
