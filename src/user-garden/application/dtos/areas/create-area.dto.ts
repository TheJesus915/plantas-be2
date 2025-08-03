import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AreaType } from '@prisma/client';

export class CreateAreaDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  image_url?: string;

  @IsOptional()
  @IsEnum(AreaType, { message: 'Area type must be INTERIOR or EXTERIOR' })
  area_type?: AreaType;
}