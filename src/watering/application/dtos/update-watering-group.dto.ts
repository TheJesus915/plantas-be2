import { IsString, IsOptional, Length, IsUrl, MaxLength } from 'class-validator';

export class UpdateWateringGroupDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters long' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

}
