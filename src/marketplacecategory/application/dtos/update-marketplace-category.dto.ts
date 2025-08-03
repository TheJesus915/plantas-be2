import { IsString, IsOptional, Length, IsBoolean } from 'class-validator';

export class UpdateMarketplaceCategoryDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name?: string;

  @IsOptional()
  @IsBoolean({ message: 'Is active must be a boolean' })
  is_active?: boolean;
}
