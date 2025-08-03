import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTaxonomicNodeDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;
}
