import { IsString, IsNotEmpty, IsEmail, Length, IsISO8601, Matches, IsOptional } from 'class-validator';

export class CreateAdminUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsString({ message: 'Lastname must be a string' })
  @IsNotEmpty({ message: 'Lastname is required' })
  @Length(2, 100, { message: 'Lastname must be between 2 and 100 characters' })
  lastname: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @Length(5, 150, { message: 'Email must be between 5 and 150 characters' })
  email: string;

  @IsISO8601({}, { message: 'Birthdate must be a valid date in ISO 8601 format' })
  @IsNotEmpty({ message: 'Birthdate is required' })
  birthdate: string;

  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @Length(8, 15, { message: 'Phone must be between 8 and 15 characters' })
  @Matches(/^\d+$/, { message: 'Phone must contain only numbers' })
  phone: string;

  @IsString({ message: 'Role ID must be a string' })
  @IsNotEmpty({ message: 'Role ID is required' })
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, {
    message: 'Role ID must be a valid UUID'
  })
  roleId: string;
}