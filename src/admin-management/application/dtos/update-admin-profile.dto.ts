import { IsString, IsNotEmpty, IsEmail, Length, IsISO8601, Matches, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { StatusAccount } from '@prisma/client';

export class UpdateAdminProfileDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Lastname must be a string' })
  @Length(2, 100, { message: 'Lastname must be between 2 and 100 characters' })
  lastname?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 150, { message: 'Email must be between 5 and 150 characters' })
  email?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'Birthdate must be a valid date in ISO 8601 format' })
  birthdate?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Length(8, 15, { message: 'Phone must be between 8 and 15 characters' })
  @Matches(/^\d+$/, { message: 'Phone must contain only numbers' })
  phone?: string;

  @IsOptional()
  @IsEnum(StatusAccount, { message: 'Status account must be either Active or Inactive' })
  status_account?: StatusAccount;

  @IsOptional()
  @IsUUID(4, { message: 'Role ID must be a valid UUID' })
  role_id?: string;
}