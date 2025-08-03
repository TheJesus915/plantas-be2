import { IsString, IsNotEmpty, IsOptional, Length, IsUUID } from 'class-validator';

export class CreateMarketplaceCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  @IsUUID(4, { message: 'Parent ID must be a valid UUID' })
  parent_id?: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  @Length(1, 500, { message: 'Image URL cannot exceed 500 characters' })
  image_url?: string;
}
