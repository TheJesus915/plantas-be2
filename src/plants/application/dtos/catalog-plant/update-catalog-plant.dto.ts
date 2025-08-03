import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUUID,
  Length,
  Min,
  Max,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCatalogPlantDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Plant type must be a string' })
  @Length(2, 50, { message: 'Plant type must be between 2 and 50 characters' })
  planttype?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Minimum temperature must be a number' })
  @Min(-50, { message: 'Minimum temperature must be at least -50°C' })
  @Max(50, { message: 'Minimum temperature must be at most 50°C' })
  mintemp?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Maximum temperature must be a number' })
  @Min(-50, { message: 'Maximum temperature must be at least -50°C' })
  @Max(80, { message: 'Maximum temperature must be at most 80°C' })
  maxtemp?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Minimum humidity must be a number' })
  minhum?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Maximum humidity must be a number' })
  maxhum?: number;

  @IsOptional()
  @IsString({ message: 'Warnings must be a string' })
  WARNINGS?: string;

  @IsOptional()
  @IsUUID(4, { message: 'Taxonomic node ID must be a valid UUID' })
  taxonomicNodeId?: string;
}