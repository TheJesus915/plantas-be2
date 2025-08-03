import { IsOptional, IsString, IsUrl, MaxLength, IsBoolean, IsNotEmpty, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePotDto {
  @IsOptional()
  @IsString({ message: 'Name must be text' })
  @MaxLength(100, { message: 'Name cannot be longer than 100 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be text' })
  description?: string;

  @IsOptional()
  @Transform(({ value }) => value === null ? '' : value)
  @IsString({ message: 'Image URL must be text' })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  image_url?: string;

  @IsOptional()
  @IsString({ message: 'Area ID must be text' })
  area_id?: string;

  @IsOptional()
  @IsString({ message: 'Plant ID must be text' })
  plant_id?: string;

  @IsOptional()
  @IsBoolean({ message: 'Watering activation status must be a boolean' })
  watering_on?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Light activation status must be a boolean' })
  light_on?: boolean;

  @IsOptional({ message: 'Floor is required' })
  @IsInt({ message: 'Floor must be number' })
  @MaxLength(2, { message: 'Floor cannot be longer than 2 characters' })
  floor?: number;
}