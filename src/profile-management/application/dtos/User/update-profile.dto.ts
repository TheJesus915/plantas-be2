import { IsOptional, IsString, Length, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileDataDto {
  @IsOptional()
  @IsDateString({}, { message: 'Birthdate must be a valid ISO date string' })
  birthdate?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Length(7, 20, { message: 'Phone must be between 7 and 20 characters' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  @Length(2, 50, { message: 'Country must be between 2 and 50 characters' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'Province must be a string' })
  @Length(2, 50, { message: 'Province must be between 2 and 50 characters' })
  province?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @Length(2, 50, { message: 'City must be between 2 and 50 characters' })
  city?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Lastname must be a string' })
  @Length(2, 50, { message: 'Lastname must be between 2 and 50 characters' })
  lastname?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileDataDto)
  profile?: ProfileDataDto;
}
