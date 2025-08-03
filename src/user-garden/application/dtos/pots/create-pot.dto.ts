import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreatePotDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be text' })
  @MaxLength(100, { message: 'Name cannot be longer than 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be text' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be text' })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  image_url?: string;

  @IsNotEmpty({ message: 'Area ID is required' })
  @IsString({ message: 'Area ID must be text' })
  area_id: string;

  @IsNotEmpty({ message: 'Plant ID is required' })
  @IsString({ message: 'Plant ID must be text' })
  plant_id: string;

  @IsNotEmpty({ message: 'Floor is required' })
  @IsInt({ message: 'Floor must be number' })
  floor: number;
}