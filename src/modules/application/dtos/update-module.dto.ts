import { IsString, IsOptional, IsBoolean, Length, Matches, ValidateIf } from 'class-validator';

export class UpdateModuleDto {
  @ValidateIf((o) => o.name !== undefined)
  @IsString({ message: 'Name must be a string' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Name can only contain letters, numbers, hyphens and underscores'
  })
  name?: string;

  @ValidateIf((o) => o.description !== undefined)
  @IsString({ message: 'Description must be a string' })
  @Length(0, 500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @ValidateIf((o) => o.is_active !== undefined)
  @IsBoolean({ message: 'Active status must be a boolean value' })
  is_active?: boolean;
}